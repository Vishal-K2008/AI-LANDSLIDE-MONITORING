import numpy as np

try:
    from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor
    SKLEARN_AVAILABLE = True
except ImportError:
    SKLEARN_AVAILABLE = False


class LandslideRiskMLModel:
    def __init__(self):
        self.is_trained = False
        self.classifier = None
        self.regressor = None
        self._initialize_and_train_model()

    def _generate_synthetic_training_data(self, samples=1000):
        """Generates realistic synthetic geotechnical and meteorological training data."""
        np.random.seed(42)
        
        # Features: [rainfall_mm, soil_moisture_pct, slope_deg, elevation_m, temp_c, humidity_pct]
        rainfall = np.random.uniform(0, 150, samples) # mm
        moisture = np.random.uniform(10, 95, samples) # %
        slope = np.random.uniform(5, 55, samples)     # degrees
        elevation = np.random.uniform(100, 2500, samples) # meters
        temp = np.random.uniform(10, 35, samples)     # celsius
        humidity = np.random.uniform(30, 100, samples)# %

        X = np.column_stack([rainfall, moisture, slope, elevation, temp, humidity])

        # Physics-informed heuristic risk formula to generate ground truth target labels
        # Landslides are primarily driven by: Rainfall (40%), Soil Moisture (35%), Slope angle (20%), Elevation (5%)
        risk_score = (
            (rainfall / 150.0) * 0.40 +
            (moisture / 100.0) * 0.35 +
            (slope / 55.0) * 0.20 +
            (elevation / 2500.0) * 0.05
        )
        # Add slight non-linear coupling (when both rain > 60mm and slope > 25deg, risk escalates)
        coupling_mask = (rainfall > 60) & (slope > 25)
        risk_score[coupling_mask] += 0.15

        # Clip probability between 0.0 and 0.99
        y_prob = np.clip(risk_score + np.random.normal(0, 0.03, samples), 0.02, 0.99)
        
        # Categorical risk level
        y_class = []
        for p in y_prob:
            if p < 0.35:
                y_class.append("LOW")
            elif p < 0.65:
                y_class.append("MODERATE")
            elif p < 0.85:
                y_class.append("HIGH")
            else:
                y_class.append("CRITICAL")
        
        return X, np.array(y_class), y_prob

    def _initialize_and_train_model(self):
        if not SKLEARN_AVAILABLE:
            print("Scikit-Learn not installed. Falling back to rule-based risk inference engine.")
            return

        try:
            X, y_class, y_prob = self._generate_synthetic_training_data(1200)
            
            self.classifier = RandomForestClassifier(n_estimators=100, random_state=42)
            self.classifier.fit(X, y_class)

            self.regressor = RandomForestRegressor(n_estimators=100, random_state=42)
            self.regressor.fit(X, y_prob)

            self.is_trained = True
            print("Successfully trained AI Landslide Risk Prediction ML Model (Random Forest).")
        except Exception as e:
            print(f"Error initializing ML model: {e}. Fallback enabled.")
            self.is_trained = False

    def predict_risk(self, rainfall_mm: float, soil_moisture_pct: float, slope_deg: float, 
                     elevation_m: float, temp_c: float = 22.0, humidity_pct: float = 80.0):
        """
        Runs prediction on input environmental parameters.
        Returns probability, level, feature importance dictionary, AI text explanation, and recommended actions.
        """
        if self.is_trained and self.regressor is not None:
            features = np.array([[rainfall_mm, soil_moisture_pct, slope_deg, elevation_m, temp_c, humidity_pct]])
            prob = float(self.regressor.predict(features)[0])
            prob = max(0.01, min(0.99, prob))
        else:
            # Deterministic rule-based fallback calculation
            rain_norm = min(rainfall_mm / 140.0, 1.0)
            moist_norm = min(soil_moisture_pct / 100.0, 1.0)
            slope_norm = min(slope_deg / 50.0, 1.0)
            elev_norm = min(elevation_m / 2500.0, 1.0)
            
            base_prob = (rain_norm * 0.42) + (moist_norm * 0.33) + (slope_norm * 0.20) + (elev_norm * 0.05)
            if rainfall_mm > 70 and slope_deg > 28:
                base_prob += 0.12
            prob = max(0.02, min(0.98, base_prob))

        # Determine level
        if prob < 0.35:
            level = "LOW"
        elif prob < 0.65:
            level = "MODERATE"
        elif prob < 0.85:
            level = "HIGH"
        else:
            level = "CRITICAL"

        # Calculate relative factor weights (percentage importance) for visual explanation
        total_input_weights = (rainfall_mm * 0.45) + (soil_moisture_pct * 0.35) + (slope_deg * 2.0) + (elevation_m * 0.02) + 1.0
        r_weight = round(((rainfall_mm * 0.45) / total_input_weights) * 100, 1)
        m_weight = round(((soil_moisture_pct * 0.35) / total_input_weights) * 100, 1)
        s_weight = round(((slope_deg * 2.0) / total_input_weights) * 100, 1)
        other_weight = round(max(0, 100 - (r_weight + m_weight + s_weight)), 1)

        feature_importance = {
            "Rainfall Intensity": r_weight,
            "Soil Moisture Saturation": m_weight,
            "Slope Angle": s_weight,
            "Elevation & Microclimate": other_weight
        }

        # Generate AI Natural Language Explanation
        explanation = self._generate_ai_explanation(level, prob, rainfall_mm, soil_moisture_pct, slope_deg, elevation_m)
        
        # Generate Recommended Preventive Actions
        recommended_action = self._generate_recommended_actions(level, rainfall_mm, slope_deg)

        return {
            "risk_probability": round(prob, 4),
            "risk_level": level,
            "factor_rainfall": r_weight,
            "factor_moisture": m_weight,
            "factor_slope": s_weight,
            "feature_importance": feature_importance,
            "ai_explanation": explanation,
            "recommended_action": recommended_action
        }

    def _generate_ai_explanation(self, level: str, prob: float, rain: float, moist: float, slope: float, elev: float) -> str:
        pct_str = f"{int(prob * 100)}%"
        
        factors = []
        if rain >= 70:
            factors.append(f"heavy rainfall ({rain:.0f} mm)")
        elif rain >= 40:
            factors.append(f"moderate rainfall ({rain:.0f} mm)")

        if moist >= 75:
            factors.append(f"high soil moisture saturation ({moist:.0f}%)")
        elif moist >= 50:
            factors.append(f"moderate soil moisture ({moist:.0f}%)")

        if slope >= 30:
            factors.append(f"a steep terrain slope ({slope:.0f}°)")
        elif slope >= 18:
            factors.append(f"moderate slope inclination ({slope:.0f}°)")

        if not factors:
            factors.append("stable meteorological and geological conditions")

        if len(factors) > 1:
            factors_str = ", ".join(factors[:-1]) + f" and {factors[-1]}"
        else:
            factors_str = factors[0]

        if level in ["HIGH", "CRITICAL"]:
            return (
                f"This location currently has a {level} landslide risk because of {factors_str}. "
                f"The combination of these severe environmental factors has increased the predicted failure probability to {pct_str}. "
                f"Ground pore-water pressure is significantly elevated, creating slope instability."
            )
        elif level == "MODERATE":
            return (
                f"This location shows a MODERATE landslide risk driven by {factors_str}. "
                f"While current slope stability is holding, the calculated risk probability of {pct_str} warrants continuous monitoring."
            )
        else:
            return (
                f"This location currently maintains a LOW landslide risk with a {pct_str} probability. "
                f"Environmental indicators reflect normal background levels with low moisture accumulation."
            )

    def _generate_recommended_actions(self, level: str, rain: float, slope: float) -> str:
        if level == "CRITICAL":
            return "🚨 IMMEDIATE EVACUATION RECOMMENDED: Issue emergency broadcast warnings, activate local emergency response units, divert traffic from downhill arterial routes, and suspend construction near steep slopes."
        elif level == "HIGH":
            return "⚠️ HIGH RISK ALERT: Restrict public access to vulnerable slope sectors, dispatch field inspection teams to check drainage channels, monitor rainfall gauges continuously, and alert nearby residents to prepare for potential evacuation."
        elif level == "MODERATE":
            return "⚡ MODERATE ADVISORY: Maintain active sensor logging, inspect slope retaining walls for surface cracks, issue precautionary driving advisories for mountain roads, and notify local emergency coordinators."
        else:
            return "✅ ROUTINE MONITORING: Continue automated telemetry logging, keep storm drains clear of debris, and perform standard weekly slope inspection."


# Global singleton instance of ML Model
risk_ai_engine = LandslideRiskMLModel()

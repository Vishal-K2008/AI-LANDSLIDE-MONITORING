import React, { useState, useEffect } from 'react';
import { 
  Location, 
  DashboardStats, 
  EarlyWarningAlert, 
  CitizenReport, 
  RiskPrediction,
  UserRole 
} from './types';
import { api } from './services/api';

import { Navbar } from './components/Navbar';
import { Sidebar, NavTab } from './components/Sidebar';
import { AIExplanationModal } from './components/AIExplanationModal';
import { CitizenReportForm } from './components/CitizenReportForm';
import { LocationDetailModal } from './components/LocationDetailModal';

import { DashboardPage } from './pages/DashboardPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { EnvironmentalPage } from './pages/EnvironmentalPage';
import { AIAnalysisPage } from './pages/AIAnalysisPage';
import { RiskTrendPage } from './pages/RiskTrendPage';
import { EarlyWarningPage } from './pages/EarlyWarningPage';
import { CitizenReportsPage } from './pages/CitizenReportsPage';
import { AdminPage } from './pages/AdminPage';
import { LocationsPage } from './pages/LocationsPage';

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('citizen');

  // Application Data States
  const [locations, setLocations] = useState<Location[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [alerts, setAlerts] = useState<EarlyWarningAlert[]>([]);
  const [reports, setReports] = useState<CitizenReport[]>([]);

  // Selected Modal States
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [explanationLoc, setExplanationLoc] = useState<Location | null>(null);
  const [explanationPred, setExplanationPred] = useState<RiskPrediction | null>(null);

  const [isExplanationModalOpen, setIsExplanationModalOpen] = useState(false);
  const [isReportFormOpen, setIsReportFormOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  // Load core application datasets
  const fetchAllData = async () => {
    try {
      const [locRes, statRes, alertRes, reportRes] = await Promise.all([
        api.getLocations(),
        api.getDashboardStats(),
        api.getAlerts(true),
        api.getCitizenReports()
      ]);
      setLocations(locRes);
      setStats(statRes);
      setAlerts(alertRes);
      setReports(reportRes);
    } catch (err) {
      console.error("Data fetch error:", err);
    }
  };

  useEffect(() => {
    fetchAllData();
    // Auto refresh every 30 seconds
    const timer = setInterval(fetchAllData, 30000);
    return () => clearInterval(timer);
  }, []);

  // Handlers
  const handleOpenAIExplanation = async (loc: Location) => {
    setExplanationLoc(loc);
    try {
      const pred = await api.getRiskPrediction(loc.id);
      setExplanationPred(pred);
    } catch {
      setExplanationPred(null);
    }
    setIsExplanationModalOpen(true);
  };

  const handleSelectLocation = (loc: Location) => {
    setSelectedLocation(loc);
    setIsLocationModalOpen(true);
  };

  const handleTriggerSimulation = async () => {
    await api.triggerSimulatedStorm();
    await fetchAllData();
  };

  const handleDismissAlert = async (alertId: number) => {
    await api.dismissAlert(alertId);
    fetchAllData();
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      setActiveTab('map');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        onSearch={handleSearch}
        onTriggerSimulation={handleTriggerSimulation}
        activeAlertCount={alerts.filter(a => a.is_active).length}
      />

      {/* Main Workspace Layout (Sidebar + Page Content) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          currentRole={currentRole}
          activeAlertsCount={alerts.filter(a => a.is_active).length}
          pendingReportsCount={reports.filter(r => r.status === 'Pending').length}
        />

        {/* Dynamic Main Viewport */}
        <main className="flex-1 overflow-y-auto pb-12">
          {activeTab === 'dashboard' && (
            <DashboardPage
              stats={stats}
              locations={locations}
              alerts={alerts}
              reports={reports}
              onSelectLocation={handleSelectLocation}
              onOpenAIExplanation={handleOpenAIExplanation}
              onOpenReportForm={() => setIsReportFormOpen(true)}
              onNavigateTab={setActiveTab}
              onDismissAlert={handleDismissAlert}
            />
          )}

          {activeTab === 'map' && (
            <RiskMapPage
              locations={locations}
              onSelectLocation={handleSelectLocation}
              onOpenAIExplanation={handleOpenAIExplanation}
              citizenReports={reports}
            />
          )}

          {activeTab === 'locations' && (
            <LocationsPage
              locations={locations}
              onSelectLocation={handleSelectLocation}
              onOpenAIExplanation={handleOpenAIExplanation}
            />
          )}

          {activeTab === 'environmental' && (
            <EnvironmentalPage locations={locations} />
          )}

          {activeTab === 'ai-analysis' && (
            <AIAnalysisPage locations={locations} />
          )}

          {activeTab === 'trends' && (
            <RiskTrendPage locations={locations} />
          )}

          {activeTab === 'alerts' && (
            <EarlyWarningPage
              alerts={alerts}
              locations={locations}
              onDismissAlert={handleDismissAlert}
              onRefreshAlerts={fetchAllData}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'reports' && (
            <CitizenReportsPage
              reports={reports}
              onOpenReportForm={() => setIsReportFormOpen(true)}
              onRefreshReports={fetchAllData}
              currentRole={currentRole}
            />
          )}

          {activeTab === 'admin' && (
            <AdminPage
              stats={stats}
              locations={locations}
              reports={reports}
              alerts={alerts}
              onTriggerSimulation={handleTriggerSimulation}
              onRefreshData={fetchAllData}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <AIExplanationModal
        location={explanationLoc}
        prediction={explanationPred}
        isOpen={isExplanationModalOpen}
        onClose={() => setIsExplanationModalOpen(false)}
      />

      <CitizenReportForm
        isOpen={isReportFormOpen}
        onClose={() => setIsReportFormOpen(false)}
        onSuccess={fetchAllData}
      />

      <LocationDetailModal
        location={selectedLocation}
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
      />
    </div>
  );
}

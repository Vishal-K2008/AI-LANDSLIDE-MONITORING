from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.database.database import get_db
from app.models.models import CitizenReport
from app.schemas.schemas import CitizenReportResponse, CitizenReportCreate, CitizenReportStatusUpdate

router = APIRouter(prefix="/citizen-reports", tags=["Citizen Reporting"])

@router.get("", response_model=List[CitizenReportResponse])
def get_citizen_reports(
    status: Optional[str] = Query(None, description="Filter by status: Pending, Verified, Rejected"),
    db: Session = Depends(get_db)
):
    query = db.query(CitizenReport)
    if status:
        query = query.filter(CitizenReport.status == status.capitalize())
    return query.order_by(CitizenReport.created_at.desc()).all()

@router.post("", response_model=CitizenReportResponse)
def submit_citizen_report(report_in: CitizenReportCreate, db: Session = Depends(get_db)):
    new_report = CitizenReport(
        reporter_name=report_in.reporter_name or "Anonymous Citizen",
        location_name=report_in.location_name,
        latitude=report_in.latitude,
        longitude=report_in.longitude,
        report_type=report_in.report_type,
        description=report_in.description,
        photo_url=report_in.photo_url or "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b3?auto=format&fit=crop&w=600&q=80",
        status="Pending"
    )
    db.add(new_report)
    db.commit()
    db.refresh(new_report)
    return new_report

@router.patch("/{report_id}/status", response_model=CitizenReportResponse)
def update_citizen_report_status(
    report_id: int, 
    update: CitizenReportStatusUpdate, 
    db: Session = Depends(get_db)
):
    report = db.query(CitizenReport).filter(CitizenReport.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Citizen report not found")
    
    if update.status not in ["Pending", "Verified", "Rejected"]:
        raise HTTPException(status_code=400, detail="Status must be Pending, Verified, or Rejected")

    report.status = update.status
    db.commit()
    db.refresh(report)
    return report

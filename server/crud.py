# crud.py

from sqlalchemy.orm import Session
from models import FileUpload

def create_file_upload(db: Session, filename: str, content: bytes):
    file_upload = FileUpload(filename=filename, content=content)
    db.add(file_upload)
    db.commit()
    db.refresh(file_upload)
    return file_upload

def get_file_upload(db: Session, file_id: int):
    return db.query(FileUpload).filter(FileUpload.id == file_id).first()

def get_most_recent_file_upload(db: Session):
    return db.query(FileUpload).order_by(FileUpload.id.desc()).first()

def delete_all_files(db: Session):
    db.query(FileUpload).delete()
    db.commit()
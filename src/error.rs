use std::{path::PathBuf, str::FromStr};

use actix_web::{http::{header::ContentType, StatusCode}, HttpResponse, ResponseError};

#[derive(Debug, derive_more::Display)]
pub enum AppError {
  FileOpenError(std::io::Error),
  ParseError(<PathBuf as FromStr>::Err),
  // ResponseError(Box<dyn actix_web::ResponseError>),
}

impl ResponseError for AppError {

  fn error_response(&self) -> HttpResponse {
    HttpResponse::build(self.status_code())
      .insert_header(ContentType::html())
      .body(self.to_string())
  }

  fn status_code(&self) -> StatusCode {
    match *self {
      _ => StatusCode::INTERNAL_SERVER_ERROR,
    }
  }

}

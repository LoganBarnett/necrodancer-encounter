use std::sync::Mutex;

use actix_web::{web::{self, Query}, HttpResponse};

use crate::{error::AppError, AppState};

// #[derive(strum::Display)]
#[derive(
  serde::Deserialize,
  derive_more::derive::Display,
  num_derive::FromPrimitive,
)]
pub enum Direction {
  Up,
  Right,
  Down,
  Left,
}

impl Direction {
  fn generate(n: u32) -> Self {
    num::FromPrimitive::from_u64(rand::prelude::random::<u64>() % 4).unwrap()
  }
}

#[derive(serde::Deserialize)]
pub struct DirectionState {
  pub directions: Vec<Direction>
}

#[derive(serde::Deserialize)]
pub struct GenerateDirectionsQueryParam {
  pub direction_count: u32
}


pub async fn index(data: web::Data<AppState>) -> String {
  let direction_state = &data.direction_state.lock().unwrap();
  format!(
    "{}",
    direction_state
      .directions
      .iter()
      .map(|x| x.to_string())
      .collect::<Vec<String>>()
      .join(","),
  )
}

pub async fn generate(
  data: web::Data<AppState>,
  query: Query<GenerateDirectionsQueryParam>,
) -> Result<HttpResponse, AppError> {
  let mut direction_state = data.direction_state.lock().unwrap();
  direction_state.directions = (0..query.direction_count)
    .step_by(1)
    .into_iter()
    .map(Direction::generate)
    .collect();
  Ok(HttpResponse::Ok().into())
}

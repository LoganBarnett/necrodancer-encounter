mod directions;
mod error;

use std::sync::Mutex;

use actix_web::{
  web,
  App,
  HttpServer,
};
use actix_files as fs;
use directions::DirectionState;
use fs::NamedFile;

use crate::error::AppError;

async fn index() -> actix_web::Result<NamedFile> {
  Ok(
    NamedFile::open("./static/index.html")
      .map_err(AppError::FileOpenError)
      ?
  )
}

async fn dance_floor() -> actix_web::Result<NamedFile> {
  Ok(
    NamedFile::open("./static/dance-floor.html")
      .map_err(AppError::FileOpenError)
      ?
  )
}

pub struct AppState {
  pub direction_state: Mutex<DirectionState>
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
  // This must be created outside of the HttpServer closure in order to give us
  // a shared, mutable state.  See https://actix.rs/docs/application/ for
  // documentation, but it doesn't offer a lot in terms of explanation in time
  // of writing.
  let state = web::Data::new(AppState {
    direction_state: Mutex::new(DirectionState { directions: vec!().into() }),
  });
  HttpServer::new(move || {
    App::new()
      // The created data must be a clone.
      .app_data(state.clone())
      .service(
        fs::Files::new("/static", "./static")
          .use_last_modified(true)
      )
      // We have to setup a custom route to provide index.html as the default at
      // the root.  This configuration allows for a root query
      // (e.g. https://localhost:8080/) to serve index.html, but it won't serve
      // up anything else (https://localhost:8080/styles.css -> 404).  But it
      // still allows us static files via
      // https://localhost:8080/static/styles.css.  This way we get proper 404s
      // and a default index.html.
      .route("/", web::get().to(index))
      .route("/dance-floor", web::get().to(dance_floor))
      .service(
        web::resource("/directions")
          .get(directions::index)
          .post(directions::generate)
      )

  })
    .bind(("0.0.0.0", 8080))?
    .run()
    .await
}

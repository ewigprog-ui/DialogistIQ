// SPDX-License-Identifier: GPL-3.0-or-later
//
// Rust side of the application. Modules from PROJECT_BIBLE.md §12.2
// (library, project, index, vcs, ai, secrets) are added stage by stage.

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

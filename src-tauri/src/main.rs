// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::new().build())
        // This is where you pass in your commands
        .invoke_handler(tauri::generate_handler![to_md5])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}

#[tauri::command]
fn to_md5(x: String) -> String {
    let digest = md5::compute(x);
    let result = format!("{:x}", digest);
    result
}

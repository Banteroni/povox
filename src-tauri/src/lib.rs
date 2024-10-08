use tauri_plugin_store::StoreExt;


#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet])
        .setup(|app| {
            app.handle().store_builder("store.bin").build();
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

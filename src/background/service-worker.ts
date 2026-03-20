chrome.runtime.onInstalled.addListener(() => {
  // Extension installed or updated
});

// Handle search-sessions command:
// Set a flag in session storage, then open the popup.
// The popup reads the flag on mount to switch to sessions view.
chrome.commands.onCommand.addListener(async (command) => {
  if (command === "search-sessions") {
    await chrome.storage.session.set({ tabflow_open_session_search: true });
    // openPopup() opens the action popup programmatically (Chrome 99+)
    try {
      await chrome.action.openPopup();
    } catch {
      // Fallback: if openPopup isn't available, the user can click the icon
    }
  }
});

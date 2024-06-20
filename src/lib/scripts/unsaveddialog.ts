export default function () {
  // the action
  function action() {
    function checkNavigation(e: any) {
          e.preventDefault();
          if (e.type === "beforeunload") {
            e.returnValue = "";
          }
        
      
    }
    window.addEventListener("beforeunload", checkNavigation);
    return {
      destory() {
        window.removeEventListener("beforeunload", checkNavigation);
      },
    };
  }
  return {action };
}


const modalDelete = () => {
    const deleteButtons = document.querySelectorAll('.deleteBtn');
    const shadow = document.querySelector(".confirmShadow");


    deleteButtons.forEach((btn) => {
        btn.addEventListener("click",(e)=>{
           // shadow.style.display="block";
            const result = confirm("Are you sure you want to delete?");
            if(!result) e.preventDefault();
        })
    })

}
modalDelete()


const checkRoute = () => {
    const routes = document.querySelectorAll(".sidebarNav a");
    routes.forEach((route)=>{
        if(route.href === window.location.href) route.classList.add("activeRoute")
    })
}
checkRoute()
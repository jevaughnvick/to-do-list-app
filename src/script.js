import { format } from "date-fns";
import { Todo, TodoContainer, CategoryContainer } from "./classes.js";



const App = (() => {

    const date = format(new Date(), "MMM dd, yyyy");
    const CATEGORYCONTAINER = new CategoryContainer();
    const MAINTODOCONTAINER = new TodoContainer();
    CATEGORYCONTAINER.addCategory(MAINTODOCONTAINER);

    const createTodo = (title, dueDate) => {

        return new Todo(title, dueDate);
    };

    const createTodoContainer = () => {

        return new TodoContainer();
    };
    
    return { date,  };
})();


const UIController = (() => {
    // allow user to interact with the program via UI

    const dateDiv = document.getElementById("date");
    const createCatBtn = document.getElementById("create-category");
    const addtodoBtn = document.getElementById("add-to-do");



    const showNewCategoryInput = () => {

        const newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("placeholder", "Type new category name");
        newInput.setAttribute("class", "js-input");

        const btnDiv = document.createElement("div");
        btnDiv.setAttribute("class", "btn-div");

        const newCategoryBtnOk = document.createElement("button");
        newCategoryBtnOk.setAttribute("class", "js-button");
        newCategoryBtnOk.setAttribute("id", "ok");
        newCategoryBtnOk.textContent = "Ok";
        newCategoryBtnOk.onclick = createCategoryDom;

        const newCategoryBtnCancel = document.createElement("button");
        newCategoryBtnCancel.setAttribute("class", "js-button");
        newCategoryBtnCancel.setAttribute("id", "cancel");
        newCategoryBtnCancel.textContent = "Cancel";
        newCategoryBtnCancel.onclick = cancelCategoryInput;
        
        const containerOne = document.querySelector(".container-one");
        createCatBtn.style.display = "none";
        containerOne.appendChild(newInput);
        btnDiv.appendChild(newCategoryBtnOk);
        btnDiv.appendChild(newCategoryBtnCancel);
        containerOne.appendChild(btnDiv);
    };

    const showNewTodoInput = () => {
        
        const newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("placeholder", "What to do?");
        newInput.setAttribute("class", "js-input-to-do");

        const newInputDate = document.createElement("input");
        newInputDate.setAttribute("type", "date");
        newInputDate.setAttribute("class", "js-input-to-do-date");

        const btnDiv = document.createElement("div");
        btnDiv.setAttribute("class", "btn-div");

        const newTodoBtnOk = document.createElement("button");
        newTodoBtnOk.setAttribute("class", "js-button");
        newTodoBtnOk.setAttribute("id", "ok");
        newTodoBtnOk.textContent = "Ok";
        newTodoBtnOk.onclick = createTodoDom;

        const newTodoBtnCancel = document.createElement("button");
        newTodoBtnCancel.setAttribute("class", "js-button");
        newTodoBtnCancel.setAttribute("id", "cancel");
        newTodoBtnCancel.textContent = "Cancel";
        newTodoBtnCancel.onclick = cancelTodoInput;

        const containerTwo = document.querySelector(".container-two");
        addtodoBtn.style.display = "none";
        containerTwo.appendChild(newInput);
        containerTwo.appendChild(newInputDate);
        btnDiv.appendChild(newTodoBtnOk);
        btnDiv.appendChild(newTodoBtnCancel);
        containerTwo.appendChild(btnDiv);
    };

    const cancelTodoInput = (e) => {

        const containerChildren = e.target.parentNode.parentNode.children;
        const containerChildrenArray = Array.from(containerChildren);
        const arrayWithoutAddBtn = containerChildrenArray.filter(item => item.id !== "add-to-do");
        arrayWithoutAddBtn.forEach(item => item.remove());
        addtodoBtn.style.removeProperty("display");
    };

    const cancelCategoryInput = (e) => {

        const containerChildren = e.target.parentNode.parentNode.children;
        const containerChildrenArray = Array.from(containerChildren);
        const arrayWithoutCatBtn = containerChildrenArray.filter(item => item.id !== "create-category");
        arrayWithoutCatBtn.forEach(item => item.remove());
        createCatBtn.style.removeProperty("display");
    };

    const createCategoryDom = (e) => {

        const parentDiv = document.querySelector(".category-names");
        const containerChildren = e.target.parentNode.parentNode.children;
        const containerChildrenArray = Array.from(containerChildren);
        const arrayWithoutCatBtn = containerChildrenArray.filter(item => item.id !== "create-category");
        const initialName = arrayWithoutCatBtn[0].value;
        const firstLetter = initialName.charAt(0).toUpperCase();
        const otherLetters = initialName.substring(1);
        const newCategoryName = `${firstLetter}${otherLetters}`;
        
        const categoryBtn = document.createElement("button");
        categoryBtn.setAttribute("class", "category");
        categoryBtn.textContent = newCategoryName;
        parentDiv.appendChild(categoryBtn);
        cancelCategoryInput(e);
        // createCategoryState;
    };

    const createCategoryState = () => {

    };

    const createTodoDom = (e) => {

        const parentDiv = document.querySelector(".to-dos");
        const containerChildren = e.target.parentNode.parentNode.children;
        const containerChildrenArray = Array.from(containerChildren);
        const arrayWithoutAddTodoBtn = containerChildrenArray.filter(item => item.id !== "add-to-do");
        const todo = arrayWithoutAddTodoBtn[0].value;
        const todoFirstLetter = todo.charAt(0).toUpperCase();
        const otherCharacters = todo.substring(1);
        const newTodoTitle = `${todoFirstLetter}${otherCharacters}`;
        const dueDate = arrayWithoutAddTodoBtn[1].value;
        
        const todoDiv = document.createElement("div");
        todoDiv.setAttribute("class", "to-do");
        todoDiv.onmouseenter = (e) => Array.from(e.target.children)[2].style.visibility = "visible";
        todoDiv.onmouseleave = (e) => Array.from(e.target.children)[2].style.visibility = "hidden";

        const todoTitleDiv = document.createElement("div");
        todoTitleDiv.setAttribute("class", "title");
        todoTitleDiv.textContent = newTodoTitle;

        const todoDateDiv = document.createElement("div");
        todoDateDiv.setAttribute("class", "due-date");
        todoDateDiv.textContent = dueDate;

        const btnWrapDiv = document.createElement("div");
        btnWrapDiv.setAttribute("class", "btn-wrap");

        const completeBtn = document.createElement("button");
        completeBtn.setAttribute("class", "todo-btn");
        completeBtn.textContent = "Completed";

        const removeBtn = document.createElement("button");
        removeBtn.setAttribute("class", "todo-btn");
        removeBtn.textContent = "Remove";

        todoDiv.appendChild(todoTitleDiv);
        todoDiv.appendChild(todoDateDiv);
        btnWrapDiv.appendChild(completeBtn);
        btnWrapDiv.appendChild(removeBtn);
        todoDiv.appendChild(btnWrapDiv);

        parentDiv.appendChild(todoDiv);
        cancelTodoInput(e);
    };


    createCatBtn.addEventListener("click", showNewCategoryInput);
    addtodoBtn.addEventListener("click", showNewTodoInput);

    return { dateDiv };
})();


const UIShowState = (() => {
    // read the state of the program and display it in the browser

    UIController.dateDiv.textContent = App.date;


})();
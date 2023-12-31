import { addDays, format, parseISO } from "date-fns";
import { Todo, TodoContainer, CategoryContainer } from "./classes.js";


const App = (() => {

    const date = format(new Date(), "MMM dd, yyyy");
    const CATEGORYCONTAINER = new CategoryContainer();
    const MAINTODOCONTAINER = new TodoContainer();
    CATEGORYCONTAINER.addCategory(MAINTODOCONTAINER, "Main", true);

    const allTodos = {
        label: "all todos",
        isActive: true,
        constraint: function(dueDate){
            return true;
        }
    };

    const today = {
        label: "today",
        isActive: false,
        constraint: function(dueDate){
            const test = format(new Date(), "M/dd/yyyy");
            return dueDate === test;
        }
    };

    const tomorrow = {
        label: "tomorrow",
        isActive: false,
        constraint: function(dueDate){
            const date = format(new Date(), "yyyy-MM-dd");
            const addedDay = addDays(parseISO(date), 1);
            return dueDate === format(addedDay, "M/dd/yyyy");
        }
    };

    const thisWeek = {
        label: "this week",
        isActive: false,
        constraint: function(dueDate){
            const date = format(new Date(), "yyyy-MM-dd");
            for(let i = 0; i < 8; i++){
                if(dueDate === format(addDays(parseISO(date), i), "M/dd/yyyy")){
                    return true;
                };
            };
            return false;
        }
    };

    const timeConstraints = [allTodos, today, tomorrow, thisWeek];

    const getActiveCategory = () => CATEGORYCONTAINER.getActiveCategory();

    const saveLocal = () => {
        localStorage.setItem("categories", JSON.stringify(CATEGORYCONTAINER.categories));
    };

    const retrieveLocal = () => {
        if(localStorage.getItem("categories")){

            const restoreMethods = (categoryObject) => {

                const todos = categoryObject.category.todos;
                categoryObject.category = new TodoContainer();
                categoryObject.category.todos = todos;
                return categoryObject;
            };

            const categoryObjectsJSON = JSON.parse(localStorage.getItem("categories"));

            const categoryObjects = categoryObjectsJSON.map(catObj => restoreMethods(catObj));

            App.CATEGORYCONTAINER.categories = categoryObjects;
            UpdateScreen.showCategories();
            UpdateScreen.highlightActiveCategory();
            UpdateScreen.setCategoryInfo();
            UpdateScreen.showTodos();
            UpdateScreen.setCounter();
        }
    };

    const setActiveCategory = (categoryName) => {

        CATEGORYCONTAINER.categories.forEach(categoryObject => {
            if(categoryName === categoryObject.categoryName && categoryObject.inCategory === false){
                deactivateOthers();
                categoryObject.inCategory = true;
            };
        });
    };

    const createTodo = (title, dueDate) => {

        const todo = new Todo(title, dueDate);
        
        getActiveCategory().category.addTodo(todo);
    };

    const createTodoContainer = (categoryName) => {

        const todoContainer = new TodoContainer();
        const inCategory = true;
        deactivateOthers();
        CATEGORYCONTAINER.addCategory(todoContainer, categoryName, inCategory);
    };

    const deactivateOthers = () => {

        CATEGORYCONTAINER.categories.forEach(cat => {
            cat.inCategory = false;
        });
    };

    const deleteCategory = (categoryName) => {

        CATEGORYCONTAINER.deleteCategory(categoryName);
    };

    const deleteTodo = (todoTitle) => {

        getActiveCategory().category.deleteTodo(todoTitle);
    };

    const activateTimeConstraint = (timePeriod) => {

        timeConstraints.forEach(obj => obj.isActive = false);

        const correspondingObj = timeConstraints.find(timeObj => timeObj.label === timePeriod);
        correspondingObj.isActive = true;
    };

    const clearLocalStorage = () => {

        localStorage.clear();
    };

    const getActiveTimePeriod = () => timeConstraints.find(obj => obj.isActive === true);
    
    return { date, CATEGORYCONTAINER, getActiveCategory, setActiveCategory, createTodoContainer, createTodo, deleteCategory, deleteTodo, activateTimeConstraint, timeConstraints, getActiveTimePeriod, saveLocal, retrieveLocal, clearLocalStorage };
})();

window.addEventListener("load", App.retrieveLocal);

const UIController = (() => {

    const createCatBtn = document.getElementById("create-category");
    const addtodoBtn = document.getElementById("add-to-do");
    const clearLocalBtn = document.getElementById("clear-storage");

    const allTodosBtn = document.getElementById("all todos");
    const todayBtn = document.getElementById("today");
    const tomorrowBtn = document.getElementById("tomorrow");
    const thisweekBtn = document.getElementById("this week");
    const timeBtnArray = [allTodosBtn, todayBtn, tomorrowBtn, thisweekBtn];

    const showNewCategoryInput = () => {

        const newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("placeholder", "Type new category name");
        newInput.setAttribute("class", "js-input");
        newInput.setAttribute("maxlength", "10");

        const btnDiv = document.createElement("div");
        btnDiv.setAttribute("class", "btn-div");

        const newCategoryBtnOk = document.createElement("button");
        newCategoryBtnOk.setAttribute("class", "js-button");
        newCategoryBtnOk.setAttribute("id", "ok");
        newCategoryBtnOk.textContent = "Ok";
        newCategoryBtnOk.onclick = createCategory;

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
        newInput.focus();
    };

    const showNewTodoInput = () => {
        
        const newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("placeholder", "What to do?");
        newInput.setAttribute("class", "js-input-to-do");
        newInput.setAttribute("maxlength", "20");

        const newInputDate = document.createElement("input");
        newInputDate.setAttribute("type", "date");
        newInputDate.setAttribute("class", "js-input-to-do-date");

        const btnDiv = document.createElement("div");
        btnDiv.setAttribute("class", "btn-div");

        const newTodoBtnOk = document.createElement("button");
        newTodoBtnOk.setAttribute("class", "js-button");
        newTodoBtnOk.setAttribute("id", "ok");
        newTodoBtnOk.textContent = "Ok";
        newTodoBtnOk.onclick = createTodo;

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
        newInput.focus();
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

    const createCategory = (e) => {

        const containerChildren = e.target.parentNode.parentNode.children;
        const containerChildrenArray = Array.from(containerChildren);
        const arrayWithoutCatBtn = containerChildrenArray.filter(item => item.id !== "create-category");
        const initialName = arrayWithoutCatBtn[0].value;
        const firstLetter = initialName.charAt(0).toUpperCase();
        const otherLetters = initialName.substring(1);
        const newCategoryName = `${firstLetter}${otherLetters}`;

        App.createTodoContainer(newCategoryName);
        cancelCategoryInput(e);
        UpdateScreen.showCategories();
        UpdateScreen.highlightActiveCategory();
        UpdateScreen.setCategoryInfo();
        UpdateScreen.showTodos();
        UpdateScreen.setCounter();
        document.getElementById("all todos").click();
        App.saveLocal();
    };

    const createTodo = (e) => {

        const containerChildren = e.target.parentNode.parentNode.children;
        const containerChildrenArray = Array.from(containerChildren);
        const arrayWithoutAddTodoBtn = containerChildrenArray.filter(item => item.id !== "add-to-do");
        const todo = arrayWithoutAddTodoBtn[0].value;
        const todoFirstLetter = todo.charAt(0).toUpperCase();
        const otherCharacters = todo.substring(1);
        const newTodoTitle = `${todoFirstLetter}${otherCharacters}`;
        const dateDayBack = format(new Date(arrayWithoutAddTodoBtn[1].value), "yyyy-MM-dd");
        const dateDayBackUnf = addDays(parseISO(dateDayBack), 1);
        const dueDate = format(dateDayBackUnf, "M/dd/yyyy");

        App.createTodo(newTodoTitle, dueDate);
        cancelTodoInput(e);
        UpdateScreen.showTodos();
        UpdateScreen.setCounter();
        document.getElementById("all todos").click();
        App.saveLocal();
    };

    const openCategory = (e) => {

        const categoryName = e.target.textContent;
        App.setActiveCategory(categoryName);
        UpdateScreen.showCategories();
        UpdateScreen.highlightActiveCategory();
        UpdateScreen.setCategoryInfo();
        UpdateScreen.showTodos();
        UpdateScreen.setCounter();
        App.saveLocal();
    };

    const removeCategory = (e) => {

        const categoryName = e.target.parentNode.textContent;
        const categoriesParentDiv = document.querySelector(".category-names");
        const catArray = Array.from(categoriesParentDiv.children);
        const currentCat = catArray.find(elem => elem.textContent === categoryName);
        const previousCategoryIndex = catArray.indexOf(currentCat)-1;
        const previousCategoryElem = catArray[previousCategoryIndex];
        App.deleteCategory(categoryName);
        previousCategoryElem.click();
        App.saveLocal();
    };

    const removeTodo = (e) => {

        const todoTitle = e.target.parentNode.parentNode.firstChild.textContent;
        
        App.deleteTodo(todoTitle);
        UpdateScreen.showTodos();
        UpdateScreen.setCounter();
        App.saveLocal();
    };

    const timePeriodBtnClick = (e) => {

        const timePeriod = e.target.textContent.toLowerCase().replace("-", "");
        App.activateTimeConstraint(timePeriod);
        UpdateScreen.highlightActiveTimePeriod();
        UpdateScreen.setTimePeriodInfo();
        UpdateScreen.showTodos();
        UpdateScreen.setCounter();
    };

    const clearStorage = () => {

        App.clearLocalStorage();
    };

    createCatBtn.addEventListener("click", showNewCategoryInput);
    addtodoBtn.addEventListener("click", showNewTodoInput);
    timeBtnArray.forEach(btn => btn.addEventListener("click", timePeriodBtnClick));
    clearLocalBtn.addEventListener("click", clearStorage);

    return { openCategory, removeCategory, removeTodo }
})();


const UpdateScreen = (() => {

    const dateDiv = document.getElementById("date");
    const categoriesParentDiv = document.querySelector(".category-names");

    const showCategories = () => {

        categoriesParentDiv.innerHTML = "";
        App.CATEGORYCONTAINER.categories.forEach(categoryObject => {

            const categoryBtn = document.createElement("button");
            categoryBtn.onclick = UIController.openCategory;
            if(categoryObject.categoryName === "Main"){
                categoryBtn.setAttribute("class", "main-category");
                categoryBtn.textContent = categoryObject.categoryName;
            }else{
                categoryBtn.setAttribute("class", "category");
                const nameDiv = document.createElement("div");
                nameDiv.textContent = categoryObject.categoryName;
                const removebtn = document.createElement("input");
                removebtn.setAttribute("type", "button");
                removebtn.setAttribute("class", "cat-btn");
                removebtn.setAttribute("value", "Remove");
                removebtn.onclick = UIController.removeCategory;
                categoryBtn.onmouseenter = (e) => Array.from(e.target.children)[1].style.visibility = "visible";
                categoryBtn.onmouseleave = (e) => Array.from(e.target.children)[1].style.visibility = "hidden";
                categoryBtn.appendChild(nameDiv);
                categoryBtn.appendChild(removebtn);
            };
            categoriesParentDiv.appendChild(categoryBtn);
        });
    };

    const highlightActiveCategory = () => {

        for(let elem of categoriesParentDiv.children){

            App.CATEGORYCONTAINER.categories.forEach(categoryObject => {
                if(elem.textContent === categoryObject.categoryName && categoryObject.inCategory){
                    elem.classList.add("active-cat-btn");
                }
            });
        };
    };

    const showTodos = () => {

        const todosOfActiveCategory = App.getActiveCategory().category.todos;
        const parentDiv = document.querySelector(".to-dos");
        parentDiv.innerHTML = "";

        todosOfActiveCategory.forEach(todo => {

            if(App.getActiveTimePeriod().constraint(todo.dueDate)){
                const todoDiv = document.createElement("div");
                todoDiv.setAttribute("class", "to-do");
                todoDiv.onmouseenter = (e) => Array.from(e.target.children)[2].style.visibility = "visible";
                todoDiv.onmouseleave = (e) => Array.from(e.target.children)[2].style.visibility = "hidden";
        
                const todoTitleDiv = document.createElement("div");
                todoTitleDiv.setAttribute("class", "title");
                todoTitleDiv.textContent = todo.title;
        
                const todoDateDiv = document.createElement("div");
                todoDateDiv.setAttribute("class", "due-date");
                todoDateDiv.textContent = todo.dueDate;
        
                const btnWrapDiv = document.createElement("div");
                btnWrapDiv.setAttribute("class", "btn-wrap");
        
                const completeBtn = document.createElement("button");
                completeBtn.setAttribute("class", "todo-btn");
                completeBtn.textContent = "Completed";
                completeBtn.onclick = UIController.removeTodo;
        
                const removeBtn = document.createElement("button");
                removeBtn.setAttribute("class", "todo-btn");
                removeBtn.textContent = "Remove";
                removeBtn.onclick = UIController.removeTodo;
        
                todoDiv.appendChild(todoTitleDiv);
                todoDiv.appendChild(todoDateDiv);
                btnWrapDiv.appendChild(completeBtn);
                btnWrapDiv.appendChild(removeBtn);
                todoDiv.appendChild(btnWrapDiv);
        
                parentDiv.appendChild(todoDiv);
            };
        });
    };

    const setCategoryInfo = () => {

        const categoryInfo = document.getElementById("category");
        categoryInfo.textContent = App.getActiveCategory().categoryName;
    };

    const setCounter = () => {

        const counter = document.getElementById("counter");
        const todosText = document.querySelector(".rest");
        counter.textContent = App.getActiveCategory().category.todos.length;
        if(App.getActiveCategory().category.todos.length === 0) todosText.textContent = "to-dos";
        if(App.getActiveCategory().category.todos.length === 1) todosText.textContent = "to-do";
        if(App.getActiveCategory().category.todos.length >= 2) todosText.textContent = "to-dos";
    };

    const highlightActiveTimePeriod = () => {

        const timesDiv = document.querySelector(".times");

        const timesDivArray = Array.from(timesDiv.children).filter(item => item.localName !== "hr" && item.localName !== "div")

        timesDivArray.forEach(btn => {

            if(btn.classList.contains("active-time-toggle")){
                btn.classList.remove("active-time-toggle");
            };

            App.timeConstraints.forEach(obj => {
                if(obj.isActive && obj.label === btn.id){
                    btn.classList.add("active-time-toggle");
                };
            });
        });
    };

    const setTimePeriodInfo = () => {

        const timePeriodInfo = document.getElementById("time-period");

        if(App.getActiveTimePeriod().label === "all todos"){
            timePeriodInfo.textContent = "All";
        };
        if(App.getActiveTimePeriod().label === "today"){
            timePeriodInfo.textContent = "Today's";
        };
        if(App.getActiveTimePeriod().label === "tomorrow"){
            timePeriodInfo.textContent = "Tomorrow's";
        };
        if(App.getActiveTimePeriod().label === "this week"){
            timePeriodInfo.textContent = "This week's";
        };
    };

    dateDiv.textContent = App.date;

    setCategoryInfo();
    showCategories();
    highlightActiveCategory();
    showTodos();
    setCounter();
    highlightActiveTimePeriod();
    setTimePeriodInfo();

    return { showCategories, highlightActiveCategory, setCategoryInfo, showTodos, setCounter, highlightActiveTimePeriod, setTimePeriodInfo };

})();



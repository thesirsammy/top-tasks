import AirDatepicker from "air-datepicker";
import "air-datepicker/air-datepicker.css";
import localeEn from "air-datepicker/locale/en";

export class Task {
  constructor(title, dueDate, priority, description) {
    this.title = title;
    this.dueDate = dueDate;
    this.priority = priority;
    this.description = description;
    this.isComplete = false;
    this.id = Math.floor(Math.random() * 100000);
  }

  toggleComplete() {
    this.isComplete = !this.isComplete;

    const task = document.getElementById(`task-${this.id}`);
    const indicator = document.getElementById(`indicator-${this.id}`);

    if (this.isComplete) {
      indicator.style.backgroundColor = "var(--selected)";
      task.style.color = "#808080";
    } else {
      indicator.style.backgroundColor = "var(--accent)";
      task.style.color = "white";
    }
  }
}

export class List {
  constructor(title, description) {
    this.title = title;
    this.description = description;
    this.listID = Math.floor(Math.random() * 100000);
    this.isSelected = false;
    this.tasks = [];
  }

  getTasks() {
    return this.tasks;
  }

  pushTask(Task) {
    this.tasks.push(Task);
  }
}

export class Viewport {
  constructor() {
    this.index = [];
  }

  pushList(list) {
    this.index.push(list);
  }

  refreshIndex() {
    const index = this.index;
    
    const sidebar = document.getElementById("sidebar");
    const listbox = document.getElementById("listbox");
    listbox.innerHTML = "";

    const existingAddListButton = document.getElementById("addList");
    if (existingAddListButton) {
      existingAddListButton.remove();
    }

    index.forEach((element) => {
      const list = document.createElement("div");
      list.classList.add("list");

      list.innerHTML = `
                <div class="list-content">
                    <h3>${element.title}</h3>
                    <div>${element.description}</div>
                </div>
                `;

      list.addEventListener("click", () => {
        this.openList(element);
        if (document.querySelector(".list-selected") !== null)
          document
            .querySelector(".list-selected")
            .classList.remove("list-selected");
        list.classList.add("list-selected");
      });

      listbox.appendChild(list);
    });

    const addListButton = document.createElement("button");
    addListButton.id = "addList";
    addListButton.innerText = "+";
    addListButton.addEventListener("click", () => this.addList());

    sidebar.appendChild(listbox);
    sidebar.appendChild(addListButton);
  }

  openList(list) {
    const content = document.getElementById("content");
    const taskbox = document.getElementById("taskbox");
    taskbox.innerHTML = "";

    const taskContent = list.getTasks();

    taskContent.forEach((element) => {
      const task = document.createElement("div");
      task.classList.add("task");
      task.id = `task-${element.id}`;

      task.innerHTML = `
                    <h3 class="task-title">${element.title}</h3>
                    <div class="task-priority">${element.priority}</div>
                    <div class="task-description">${element.description}</div>`;

      const indicator = document.createElement("div");
      indicator.classList.add("task-indicator");
      indicator.id = `indicator-${element.id}`;
      task.insertBefore(indicator, task.firstChild);
      indicator.addEventListener("click", () => element.toggleComplete());

      const taskDetails = document.createElement("div");
      taskDetails.classList.add("task-details");
      taskDetails.innerHTML = `<div>${element.dueDate}</div>`;

      const del = document.createElement("div");
      del.innerText = "delete";
      del.classList.add("task-edit");
      del.addEventListener("click", () => this.deleteTask(list, element));

      const edit = document.createElement("div");
      edit.classList.add("task-edit");
      edit.innerText = "edit";
      edit.addEventListener("click", () => this.editTask(list, element));

      taskDetails.appendChild(del);
      taskDetails.appendChild(edit);

      task.appendChild(taskDetails);

      taskbox.appendChild(task);
    });

    const addTaskButton = document.createElement("button");
    addTaskButton.setAttribute("id", "addTask");
    addTaskButton.innerText = "+";
    addTaskButton.addEventListener("click", () => this.addTask(list));

    content.appendChild(taskbox);
    taskbox.appendChild(addTaskButton);
  }

  //move to Popup class later
  addTask(list) {
    document.getElementById("popup").classList.remove("hidden");
    const popupExit = document.getElementById("popupExit");

    document.forms["popupForm"]["title"].value = "";
    document.forms["popupForm"]["taskDueDate"].value = "";
    document.forms["popupForm"]["taskNotes"].value = "";

    new AirDatepicker("#popupDueDate", {
      locale: localeEn,
    });

    const handleExit = () => {
      if (document.forms["popupForm"]["title"].value !== "") {
        const task = new Task();
        task.title = document.forms["popupForm"]["title"].value;
        task.dueDate = document.forms["popupForm"]["taskDueDate"].value;
        task.priority = document.forms["popupForm"]["taskPriority"].value;
        task.description = document.forms["popupForm"]["taskNotes"].value;
        list.pushTask(task);
      }

      document.getElementById("popup").classList.add("hidden");
      this.openList(list);
      popupExit.removeEventListener("click", handleExit);

      this.save();
    };

    popupExit.removeEventListener("click", handleExit);
    popupExit.addEventListener("click", handleExit);
  }

  editTask(list, task) {
    document.getElementById("popup").classList.remove("hidden");
    const popupExit = document.getElementById("popupExit");

    document.forms["popupForm"]["title"].value = task.title || "";
    document.forms["popupForm"]["taskDueDate"].value = task.dueDate || "";
    document.forms["popupForm"]["taskPriority"].value = task.priority || "";
    document.forms["popupForm"]["taskNotes"].value = task.description || "";

    new AirDatepicker("#popupDueDate", {
      locale: localeEn,
    });

    const handleExit = () => {
      if (document.forms["popupForm"]["title"].value !== "") {
        task.title = document.forms["popupForm"]["title"].value;
        task.dueDate = document.forms["popupForm"]["taskDueDate"].value;
        task.priority = document.forms["popupForm"]["taskPriority"].value;
        task.description = document.forms["popupForm"]["taskNotes"].value;
      }

      document.getElementById("popup").classList.add("hidden");
      this.openList(list);
      popupExit.removeEventListener("click", handleExit);

      this.save();
    };

    popupExit.removeEventListener("click", handleExit);
    popupExit.addEventListener("click", handleExit);
  }

  deleteTask(list, task) {
    let toRemove = 0;

    for (let i = 0; i < list.getTasks().length; i++) {
      if (list.getTasks()[i] == task) {
        toRemove = i;
        break;
      }
    }

    list.getTasks().splice(toRemove, 1);
    this.openList(list);

    this.save();
  }

  addList() {
    document.getElementById("popup").classList.remove("hidden");
    const popupExit = document.getElementById("popupExit");

    document.forms["popupForm"]["title"].value = "";
    document.forms["popupForm"]["taskNotes"].value = "";

    document.getElementById("popupDueDate").classList.add("hidden");
    document.getElementById("popupPriority").classList.add("hidden");
    document.getElementById("popupDueDateLabel").classList.add("hidden");
    document.getElementById("popupPriorityLabel").classList.add("hidden");

    const handleExit = () => {
      if (document.forms["popupForm"]["title"].value !== "") {
        const list = new List();
        list.title = document.forms["popupForm"]["title"].value;
        list.description = document.forms["popupForm"]["taskNotes"].value;
        this.pushList(list);
      }

      document.getElementById("popupDueDate").classList.remove("hidden");
      document.getElementById("popupPriority").classList.remove("hidden");
      document.getElementById("popupDueDateLabel").classList.remove("hidden");
      document.getElementById("popupPriorityLabel").classList.remove("hidden");

      document.getElementById("popup").classList.add("hidden");
      popupExit.removeEventListener("click", handleExit);
      this.refreshIndex();

      this.save();
    };
    popupExit.removeEventListener("click", handleExit);
    popupExit.addEventListener("click", handleExit);
  }

  save() {
    const data = this.index.map((list) => ({
      title: list.title,
      description: list.description,
      listID: list.listID,
      isSelected: list.isSelected,
      tasks: list.getTasks().map((task) => ({
        title: task.title,
        dueDate: task.dueDate,
        priority: task.priority,
        description: task.description,
        isComplete: task.isComplete,
        id: task.id,
      })),
    }));

    localStorage.setItem("viewportData", JSON.stringify(data));
  }

  load() {
    const data = localStorage.getItem("viewportData");
    if (!data) return;

    const parsedData = JSON.parse(data);

    this.index = parsedData.map((listData) => {
      const list = new List(listData.title, listData.description);
      list.listID = listData.listID;
      list.isSelected = listData.isSelected;

      listData.tasks.forEach((taskData) => {
        const task = new Task(
          taskData.title,
          taskData.dueDate,
          taskData.priority,
          taskData.description,
        );
        task.isComplete = taskData.isComplete;
        task.id = taskData.id;
        list.pushTask(task);
      });
      return list;
    });

    this.refreshIndex();
  }
}

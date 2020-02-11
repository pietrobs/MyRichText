class EditorController {
  wrapperEditor = null;
  editorElement = null;
  constructor(editorId) {
    this.wrapperEditor = document.getElementById(editorId);
    this.editorElement = document.createElement("div");
    this.editorElement.setAttribute("contentEditable", true);
    this.editorElement.setAttribute("class", "editor");
    this.toolbarController = new Toolbar(() => this.editorElement.focus());
    this.wrapperEditor.appendChild(this.toolbarController.getElement);
    this.wrapperEditor.appendChild(this.editorElement);

    this.start();
  }

  start() {
    this.editorElement.innerHTML = "Hello editor world!";
  }

  getFocus() {
    console.log(this.editorElement);
    this.editorElement.focus();
  }
}

class Toolbar {
  fontSize = 7;
  toolbarElement = null;
  tools = [
    {
      type: "button",
      title: "Bold",
      icon: '<i class="fas fa-bold"></i>',
      activate: true,
      action: {
        command: "bold"
      }
    },
    {
      type: "button",
      title: "Italic",
      icon: '<i class="fas fa-italic"></i>',
      activate: true,
      action: {
        command: "italic"
      }
    },
    {
      type: "button",
      title: "Underline",
      icon: '<i class="fas fa-underline"></i>',
      activate: true,
      action: {
        command: "underline"
      }
    },
    {
      type: "button",
      title: "List",
      activate: true,
      icon: '<i class="fas fa-list-ol"></i>',
      action: {
        command: "insertOrderedList"
      }
    },
    {
      type: "button",
      title: "List",
      activate: true,
      icon: '<i class="fas fa-list-ul"></i>',
      action: {
        command: "insertUnorderedList"
      }
    },
    {
      type: "button",
      title: "Justify left",
      icon: '<i class="fas fa-align-left"></i>',
      action: {
        command: "justifyLeft"
      }
    },
    {
      type: "button",
      title: "Justify center",
      icon: '<i class="fas fa-align-center"></i>',
      action: {
        command: "justifyCenter"
      }
    },
    {
      type: "button",
      title: "Justify right",
      icon: '<i class="fas fa-align-right"></i>',
      action: {
        command: "justifyRight"
      }
    },
    {
      type: "button",
      title: "Justify",
      icon: '<i class="fas fa-align-justify"></i>',
      action: {
        command: "justifyFull"
      }
    },
    {
      type: "button",
      title: "Undo",
      icon: '<i class="fas fa-undo"></i>',
      action: {
        command: "undo"
      }
    },
    {
      type: "button",
      title: "Redo",
      icon: '<i class="fas fa-redo"></i>',
      action: {
        command: "redo"
      }
    },
    {
      type: "colorBox",
      icon: "Background color",
      action: {
        command: "backColor"
      }
    },
    {
      type: "colorBox",
      icon: "Text color",
      action: {
        command: "foreColor"
      }
    }
  ];

  constructor(setFocus) {
    this.toolbarElement = document.createElement("div");
    this.toolbarElement.setAttribute("class", "toolbar");
    this.setEditorFocus = setFocus;

    this.tools.forEach(({ type, title, icon, action, activate }) => {
      let tool = null;

      switch (type) {
        case "button":
          tool = this.createButton(title, icon, action, activate);
          break;
        case "colorBox":
          tool = this.createColorBox(title, icon, action);
          break;
      }
      this.toolbarElement.appendChild(tool);
    });
  }

  get getElement() {
    return this.toolbarElement;
  }

  execute(commandName, value) {
    document.execCommand(commandName, false, value);
    this.setEditorFocus();
  }

  createButton = (title, icon, action, activate) => {
    const button = document.createElement("button");
    button.className = "editor-button";
    button.title = title;
    button.type = "button";
    button.innerHTML = this.createTooltip(title, icon);
    button.active = false;
    button.addEventListener("click", () => {
      if (activate) {
        if (button.active) {
          button.className = "editor-button";
        } else {
          button.className = "editor-button active";
        }
      }
      this.execute(action.command, action.value);
      button.active = !button.active;
    });

    return button;
  };

  createColorBox = (title, icon, action) => {
    const colorBox = document.createElement("input");
    const label = document.createElement("label");

    colorBox.id = "color_" + action.command;
    colorBox.type = "color";
    colorBox.style.display = "none";
    colorBox.innerHTML = this.createTooltip(title, icon);
    colorBox.active = false;
    colorBox.addEventListener("change", e => {
      if (colorBox.active) {
        colorBox.className = "editor-button";
        this.execute(action.command, "#000");
      } else {
        colorBox.className = "editor-button active";
        this.execute(action.command, e.target.value);
      }
      colorBox.active = !colorBox.active;
    });

    label.className = "editor-button";
    label.setAttribute("for", "color_" + action.command);

    colorBox.addEventListener("click", e => {
      if (colorBox.active) {
        colorBox.className = "editor-button";
      } else {
        colorBox.className = "editor-button active";
      }
      colorBox.active = !colorBox.active;
      this.execute(action.command, e.target.value);
    });

    return label;
  };

  createTooltip(title, icon) {
    return `<span class="tool" data-tip='${title}' tabindex="1">${icon}</span>`;
  }
}

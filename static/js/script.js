document.addEventListener('DOMContentLoaded', () => {
    const dashboard = document.getElementById('dashboard');
    const widgets = document.querySelectorAll('.widget');
    const saveButton = document.getElementById('saveButton');
    
    let draggedWidget = null;

    // Add drag and drop listeners to each widget
    widgets.forEach(widget => {
        widget.addEventListener('dragstart', handleDragStart);
        widget.addEventListener('dragend', handleDragEnd);
        widget.addEventListener('dragover', handleDragOver);
        widget.addEventListener('drop', handleDrop);
    });

    // Handles the start of dragging a widget and sets up the drag operation
    function handleDragStart(e) {
        draggedWidget = this;
        // We use the class 'dragging' to visually indicate that the widget is being dragged.
        // See style.css for more details.
        this.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', this.innerHTML);
    }

    // Cleans up styles and references when dragging ends
    function handleDragEnd(e) {
        this.classList.remove('dragging');
        widgets.forEach(widget => {
            widget.classList.remove('drag-over');
        });
        draggedWidget = null;
    }

    // Handles the dragover event and adds visual feedback
    // preventDefault() is required here because without it the drop event won't fire
    function handleDragOver(e) {
        e.preventDefault();
        // In our use case, 'move' should be the only appropriate effect.
        //
        // For example, 'link' makes the cursor looks like a stop mark,
        // probably as the drop target is not a text area.
        // Same for 'copy'.
        //
        // If you are curious, see the full list of possible effects here:
        // https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer/dropEffect#value
        // and try seeing what happens if you change the effect.
        e.dataTransfer.dropEffect = 'move';
        this.classList.add('drag-over');
    }

    // Handles the actual dropping of a widget and reorders elements
    function handleDrop(e) {
        this.classList.remove('drag-over');
        
        // Note that `this` is the widget that is being dropped onto
        // `draggedWidget` is the widget that is being dragged
        if (draggedWidget !== this) {
            const allWidgets = [...dashboard.getElementsByClassName('widget')];
            const draggedPos = allWidgets.indexOf(draggedWidget);
            const droppedPos = allWidgets.indexOf(this);

            if (draggedPos < droppedPos) {
                this.parentNode.insertBefore(draggedWidget, this.nextSibling);
            } else {
                this.parentNode.insertBefore(draggedWidget, this);
            }
        }
    }

    // Saves the current dashboard configuration to console
    saveButton.addEventListener('click', () => {
        const configuration = [];
        dashboard.querySelectorAll('.widget').forEach((widget, index) => {
            configuration.push({
                widgetId: widget.dataset.widgetId,
                position: index,
                // Just for illustration purposes.
                // In a real application, you might not want to save the title,
                // as it's not customizable by the user.
                title: widget.querySelector('.widget-header').textContent
            });
        });
        
        console.log('Dashboard Configuration:', configuration);
        alert('Configuration saved! Check the console for details.');

        // In a real application, you might want to save this configuration to a server or local storage,
        // so that on next page load, the dashboard is restored to the saved configuration.
    });
}); 
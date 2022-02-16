import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const grid = 8;

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function Widget({ widget, index }) {
  return (
    <Draggable draggableId={widget.id} index={index}>
      {provided => (
        <div className="border border-solid border-grey-100"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {widget.content}
        </div>
      )}
    </Draggable>
  );
}

const WidgetList = React.memo(function WidgetList({ widgets }) {
  return widgets.map((widget, index) => (
    <Widget widget={widget} index={index} key={widget.id} />
  ));
});


function Column({ droppableId, widgets }) {
  return (
    <Droppable droppableId={droppableId}>
      {provided => (
        <div className="w-64" ref={provided.innerRef} {...provided.droppableProps}>
          <WidgetList widgets={widgets} />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

const initial = {
  "column-1": [
    {
      id: "widget-1",
      content: "hello"
    },
    {
      id: "widget-2",
      content: "this"
    },
    {
      id: "widget-3",
      content: "is"
    },
    {
      id: "widget-4",
      content: "so99ynoodles"
    }
  ],
  "column-2": [
    {
      id: "widget-5",
      content: "I am"
    },
    {
      id: "widget-6",
      content: "a Web"
    },
    {
      id: "widget-7",
      content: "developer"
    }
  ]
};
export default function DashboardApp() {
  const [state, setState] = useState({ widgets: initial });

  function onDragEnd(result) {
    const { source, destination } = result;
    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId) {
      if (destination.index === source.index) {
        return;
      }

      const widgets = reorder(
        state.widgets[source.droppableId],
        source.index,
        destination.index
      );

      const updateState = {
        widgets: {
          ...state.widgets,
          [source.droppableId]: widgets
        }
      };

      setState(updateState);
    } else {
      const startColumn = [...state.widgets[source.droppableId]];
      const finishColumn = [...state.widgets[destination.droppableId]];
      const [removed] = startColumn.splice(source.index, 1);
      finishColumn.splice(destination.index, 0, removed);

      const updateState = {
        widgets: {
          ...state.widgets,
          [source.droppableId]: startColumn,
          [destination.droppableId]: finishColumn
        }
      };
      setState(updateState);
    }
  }
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex">
        <Column widgets={state.widgets["column-1"]} droppableId="column-1" />
        <Column widgets={state.widgets["column-2"]} droppableId="column-2" />
      </div>
    </DragDropContext>
  );
};

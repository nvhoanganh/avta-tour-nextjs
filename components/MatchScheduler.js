import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getAllGroupMatchesfull } from '../lib/browserapi';

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
        <div className="border border-solid border-grey-100 p-2"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {widget.group} : {widget.between[0].name} vs {widget.between[1].name}
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
        <div className="w-64 border border-solid border-gray-300 rounded shadow-md flex flex-col space-y-2 p-2" ref={provided.innerRef} {...provided.droppableProps}>
          <WidgetList widgets={widgets} />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default function DashboardApp({ groupsAllocation, courts }) {
  const allMatches = getAllGroupMatchesfull(groupsAllocation, courts);

  const [state, setState] = useState({ widgets: allMatches });

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
      <div className="flex space-x-3">
        {Object.keys(state.widgets).sort().map((group, index) => (
          <div>
            <div className="text-bold text-lg py-3">Court {group}</div>
            <Column widgets={state.widgets[group]} droppableId={group} />
          </div>
        ))}
      </div>
    </DragDropContext>
  );
};

import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getAllGroupMatchesfull } from '../lib/browserapi';

const grid = 8;
const colors = ['']
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
        <div className="border border-solid border-gray-300 p-2 bg-white shadow"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {widget.group}{ index + 1 } : {widget.between[0].name} vs {widget.between[1].name}
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


function Column({ droppableId, widgets, readonly }) {
  return (
    <Droppable droppableId={droppableId} isDragDisabled={readonly}>
      {provided => (
        <div className="w-64 border border-solid border-gray-300 rounded shadow-md flex flex-col space-y-2 p-2 py-4 bg-gray-50" ref={provided.innerRef} {...provided.droppableProps}>
          <WidgetList widgets={widgets} />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default function DashboardApp({ groupsAllocation, courts, saveSchedule, readonly }) {
  const [state, setState] = useState({ widgets: {} });

  useEffect(() => {
    const allMatches = getAllGroupMatchesfull(groupsAllocation, courts);
    setState({ widgets: allMatches });
  }, [courts, groupsAllocation]);

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

  const save = () => { saveSchedule && saveSchedule(state.widgets) }

  const reset = () => {
    const allMatches = getAllGroupMatchesfull(groupsAllocation, courts);
    setState({ widgets: allMatches });
  }

  return (
    <div>
      <div className="flex space-x-1">
        <button
          tupe="button"
          onClick={save}
          className="bg-blue-500 active:bg-blue-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
          Save
        </button>

        <button
          tupe="button"
          onClick={reset}
          className="bg-gray-500 active:bg-gray-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
          Reset
        </button>

      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-3">
          {Object.keys(state.widgets).sort().map((group, index) => (
            <div key={group}>
              <div className="text-bold text-xl text-center py-3">{group}</div>
              <Column widgets={state.widgets[group]} droppableId={group} readonly={readonly} />
            </div>
          ))}
        </div>
      </DragDropContext>

    </div>


  );
};

import React, { useState, useEffect } from "react";
import cn from 'classnames';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GroupsColours, getAllGroupMatchesfull } from '../lib/browserapi';

const grid = 8;
const colors = ['']
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

function Widget({ widget, index, allColumns, droppableId, deleteWidget }) {
  const clashed = Object.keys(allColumns).map(court => {
    if (court === droppableId) return null;

    const sameMatch = allColumns[court][index];
    if (!sameMatch) return null;
    if (sameMatch.isPlaceholder) return null;
    if (widget.between && (sameMatch.id.indexOf(widget.between[0].id) >= 0 || sameMatch.id.indexOf(widget.between[1].id) >= 0)) {
      return { court, match: allColumns[court][index], index }
    }
    return null;
  }).filter(x => !!x);

  return (
    <Draggable draggableId={widget.id} index={index}>
      {provided => (
        <div className={`border border-solid border-gray-300 p-2 shadow bg-${GroupsColours[widget.group]}-50 w-60 h-32`}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={`flex pl-2 pt-1 font-bold text-xl text-${GroupsColours[widget.group]}-600 `} >{widget.group}
            <span className="text-sm">{index + 1}</span>
          </div>
          {
            !widget.isPlaceholder
              ?
              <>
                <div className=" whitespace-nowrap truncate overflow-hidden">{widget.between[0].player1.fullName} + {widget.between[0].player2.fullName}</div>
                <div><span className="font-bold">vs.</span>
                  {
                    clashed.length > 0
                      ? <span className="ml-2 text-red-600 font-bold">❌ Clashed</span>
                      : null
                  }
                </div>
                <div className=" whitespace-nowrap truncate overflow-hidden">{widget.between[1].player1.fullName} + {widget.between[1].player2.fullName}</div>
              </>
              :
              <div>
                <div className=" whitespace-nowrap truncate overflow-hidden font-bold">Court </div>
                <div><span className="font-bold">is Not Avaiable</span>
                </div>
                <div className=" whitespace-nowrap truncate overflow-hidden">
                  <button type="button" className="underline" onClick={() => deleteWidget(widget.id)}>
                    Delete
                  </button>
                </div>
              </div>
          }
        </div>
      )}
    </Draggable>
  );
}

const WidgetList = React.memo(function WidgetList({ widgets, allColumns, droppableId, deleteWidget }) {
  return widgets.map((widget, index) => (
    <Widget widget={widget} index={index} key={widget.id} allColumns={allColumns} droppableId={droppableId} deleteWidget={deleteWidget} />
  ));
});

function Column({ droppableId, widgets, readonly, allColumns, deleteWidget }) {
  return (
    <Droppable droppableId={droppableId} isDragDisabled={readonly}>
      {provided => (
        <div className="w-64 border border-solid border-gray-300 rounded shadow-md flex flex-col space-y-2 p-2 py-4 bg-gray-50" ref={provided.innerRef} {...provided.droppableProps}>
          <WidgetList widgets={widgets} allColumns={allColumns} droppableId={droppableId} deleteWidget={deleteWidget} />
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
}

export default function DashboardApp({ groupsAllocation, courts, saveSchedule, readonly, schedule, editMode, cancelEdit }) {
  const [state, setState] = useState({ widgets: schedule ? { ...JSON.parse(JSON.stringify(schedule)) } : {} });

  useEffect(() => {
    if (!editMode) {
      const allMatches = getAllGroupMatchesfull(groupsAllocation, courts);
      setState({ widgets: allMatches });
    }
  }, [courts, groupsAllocation, schedule, editMode]);

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
    ;
    const allMatches = getAllGroupMatchesfull(groupsAllocation, courts);
    setState({ widgets: allMatches });
  }

  const addGap = () => {
    const firstCourt = Object.keys(state.widgets).sort()[0];
    const firstCourtMatch = state.widgets[firstCourt].push({
      id: (new Date()).getTime().toString(),
      isPlaceholder: true,
      group: ''
    });
    setState({ widgets: { ...state.widgets } });
  }

  const addCourt = () => {
    const newCourt = prompt('Enter new court name. E.g Court 8');
    if (!newCourt) {
      return;
    }
    setState({ widgets: { ...state.widgets, [newCourt]: [] } });
  }

  const deleteWidget = (id) => {
    Object.keys(state.widgets).forEach(court => {
      state.widgets[court] = state.widgets[court].filter(x => x.id !== id);
    });
    setState({ widgets: { ...state.widgets } });
  }

  const deleteCourt = (court) => {
    const firstCourt = Object.keys(state.widgets).sort()[0];
    state.widgets[firstCourt].push(...state.widgets[court]);
    delete state.widgets[court];
    setState({ widgets: { ...state.widgets } });
  }

  return (
    <div>
      {/* colors placeholder */}
      <div className="hidden bg-red-50 bg-green-50 bg-yellow-50 bg-blue-50 bg-purple-50 bg-indigo-50
      bg-purple-50 bg-pink-50 bg-yellow-50 bg-gray-50
      "></div>
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

        <button
          tupe="button"
          onClick={addGap}
          className="bg-gray-500 active:bg-gray-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
          Add Gap
        </button>

        <button
          tupe="button"
          onClick={addCourt}
          className="bg-gray-500 active:bg-gray-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
          Add Court
        </button>

        {
          editMode
            ? <button
              tupe="button"
              onClick={cancelEdit}
              className="bg-gray-500 active:bg-gray-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-3 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150">
              Cancel
            </button>
            : null
        }

      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex space-x-3">
          {Object.keys(state.widgets).sort().map((group, index) => (
            <div key={group}>
              <div className="text-bold text-xl text-center py-3">{group}
                {
                  index > 0
                    ? <button type="button" className="text-sm" onClick={() => deleteCourt(group)}>❌</button>
                    : null
                }
              </div>
              <Column widgets={state.widgets[group]} droppableId={group} readonly={readonly} allColumns={state.widgets} deleteWidget={deleteWidget} />
            </div>
          ))}
        </div>
      </DragDropContext>

    </div>


  );
};

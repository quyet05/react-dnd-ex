import { Box, Flex, Heading, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";

const Column = dynamic(() => import("../src/Column"), { ssr: false });

const reorderColumnList = (sourceCol, startIndex, endIndex) => {
  const newTaskIds = Array.from(sourceCol.taskIds);
  const [removed] = newTaskIds.splice(startIndex, 1);
  newTaskIds.splice(endIndex, 0, removed);

  const newColumn = {
    ...sourceCol,
    taskIds: newTaskIds,
  };

  return newColumn;
};

export default function Home() {
  // const [state, setState] = useState(initialData);
  const [columns, setColumns] = useState(columnData);
  const [columnTask, setColumnTask] = useState(columTaskData);

  const getColumWithId = (columnId) => {
    switch (columnId) {
      case "1":
        return columnTask;

      default:
        return columns.find((column) => column.id === columnId);
    }
  };

  const onDragEnd = (result) => {
    const { destination, source } = result;

    // If user tries to drop in an unknown destination
    if (!destination) return;

    // if the user drags and drops back in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const sourceCol = getColumWithId(source?.droppableId);
    const destinationCol = getColumWithId(destination?.droppableId);

    // If the user drops within the same column but in a different position
    if (sourceCol.id === destinationCol.id) {
      return;
    }

    // If the user moves from one column to another
    const sourceTasks = sourceCol.tasks || [];
    const [removed] = sourceTasks.splice(source.index, 1);

    const destinationTasks = destinationCol.tasks || [];
    destinationTasks.splice(destination.index, 0, removed);

    const newColumnData = columns.map((column) => {
      if (column.id === sourceCol.id) {
        column.tasks = sourceTasks;
      }

      if (column.id === destinationCol.id) {
        column.tasks = destinationTasks;
      }
      return column;
    });
    console.log("new column", newColumnData);
    console.log("column task", columnTask);

    setColumns(newColumnData);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Flex
        flexDir="row"
        justify="space-between"
        w="full"
        h="full"
        bg="main-bg"
      >
        <Flex
          flexDir="column"
          bg="main-bg"
          minH="100vh"
          w="full"
          color="white-text"
          pb="2rem"
          h="full"
        >
          <Flex py="4rem" flexDir="column" align="center">
            <Heading fontSize="3xl" fontWeight={600}>
              React Beautiful Drag and Drop
            </Heading>
            <Text fontSize="20px" fontWeight={600} color="subtle-text">
              react-beautiful-dnd
            </Text>
          </Flex>

          <Flex
            flexDirection="column"
            justify="space-between"
            px="4rem"
            gap="20px"
          >
            {columns.map((column, index) => (
              <Column key={column.id} column={column} />
            ))}
          </Flex>
        </Flex>

        <Flex
          flexDir="column"
          bg="main-bg"
          color="white-text"
          pb="2rem"
          mt="200px"
          position="static"
          pos="relative"
        >
          <Column column={columnTask} width={400} />
        </Flex>
      </Flex>
    </DragDropContext>
  );
}

const taskData = [
  { id: 1, content: "Configure Next.js application" },
  { id: 2, content: "Configure Next.js and tailwind " },
  { id: 3, content: "Create sidebar navigation menu" },
  { id: 4, content: "Create page footer" },
  { id: 5, content: "Create page navigation menu" },
  { id: 6, content: "Create page layout" },
  { id: 7, content: "Create page layout" },
  { id: 8, content: "Create page layout" },
  { id: 9, content: "Create page layout" },
  { id: 10, content: "Create page layout" },
];

const columnData = [
  {
    id: "2",
    title: "TO-DO",
    tasks: [],
  },
  {
    id: "3",
    title: "IN-PROGRESS",
    tasks: [],
  },
  {
    id: "4",
    title: "COMPLETED",
    tasks: [],
  },
];

const columTaskData = {
  id: "1",
  title: "TASKS",
  tasks: [...taskData],
};

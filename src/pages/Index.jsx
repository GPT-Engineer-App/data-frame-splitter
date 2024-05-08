import React, { useState } from 'react';
import { Container, VStack, Text, Button, Table, Thead, Tbody, Tr, Th, Td, Input, useToast } from '@chakra-ui/react';
import { parse } from 'papaparse';

const Index = () => {
  const [tables, setTables] = useState([]);
  const toast = useToast();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      parse(file, {
        complete: (results) => {
          const data = results.data;
          const splitTables = [];
          let currentTable = [];

          data.forEach((row, index) => {
            if (row.every(cell => cell === "")) {
              if (currentTable.length > 0) {
                splitTables.push(currentTable);
                currentTable = [];
              }
            } else {
              currentTable.push(row);
            }

            if (index === data.length - 1 && currentTable.length > 0) {
              splitTables.push(currentTable);
            }
          });

          setTables(splitTables);
        },
        header: false,
        skipEmptyLines: false
      });
    }
  };

  const downloadCSV = (tableData, index) => {
    const csvContent = "data:text/csv;charset=utf-8," + tableData.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `table_${index + 1}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Text fontSize="2xl" fontWeight="bold">CSV Data Splitter</Text>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        {tables.map((table, index) => (
          <VStack key={index} spacing={4} align="stretch">
            <Button onClick={() => downloadCSV(table, index)}>Download Table {index + 1}</Button>
            <Table variant="simple">
              <Thead>
                <Tr>{table[0].map((header, idx) => <Th key={idx}>{header}</Th>)}</Tr>
              </Thead>
              <Tbody>
                {table.slice(1).map((row, idx) => (
                  <Tr key={idx}>
                    {row.map((cell, cellIdx) => <Td key={cellIdx}>{cell}</Td>)}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </VStack>
        ))}
      </VStack>
    </Container>
  );
};

export default Index;
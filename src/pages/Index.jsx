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
          const splitTables = splitCSVData(results.data);
          setTables(splitTables);
          toast({
            title: 'File processed',
            description: 'The CSV file has been successfully split into tables.',
            status: 'success',
            duration: 5000,
            isClosable: true,
          });
        },
        header: false,
        skipEmptyLines: false,
      });
    }
  };

  const splitCSVData = (data) => {
    let tables = [];
    let currentTable = [];
    data.forEach((row, index) => {
      if (row.every(cell => cell === "")) {
        if (currentTable.length > 0) {
          tables.push(currentTable);
          currentTable = [];
        }
      } else {
        currentTable.push(row);
      }
    });
    if (currentTable.length > 0) tables.push(currentTable);
    return tables;
  };

  const renderTable = (tableData, index) => (
    <Table variant="simple" key={index} mb={10}>
      <Thead>
        <Tr>{tableData[0].map((header, idx) => <Th key={idx}>{header || `Column ${idx + 1}`}</Th>)}</Tr>
      </Thead>
      <Tbody>
        {tableData.slice(1).map((row, idx) => (
          <Tr key={idx}>
            {row.map((cell, index) => <Td key={index}>{cell}</Td>)}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  return (
    <Container maxW="container.xl" p={5}>
      <VStack spacing={8}>
        <Text fontSize="2xl" mb={4}>CSV Data Splitter</Text>
        <Input type="file" accept=".csv" onChange={handleFileUpload} p={1} />
        {tables.length > 0 && (
          <VStack w="full" overflowX="auto">
            {tables.map((table, index) => renderTable(table, index))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
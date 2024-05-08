import { useState } from 'react';
import { Container, VStack, Text, Button, Input, Table, Thead, Tbody, Tr, Th, Td, Box } from '@chakra-ui/react';
import { parse } from 'papaparse';

const Index = () => {
  const [tables, setTables] = useState([]);

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
          });

          if (currentTable.length > 0) {
            splitTables.push(currentTable);
          }

          setTables(splitTables);
        }
      });
    }
  };

  const renderTable = (tableData, index) => (
    <Table variant="simple" key={index} mb={10}>
      <Thead>
        <Tr>{tableData[0].map((header, idx) => <Th key={idx}>{header}</Th>)}</Tr>
      </Thead>
      <Tbody>
        {tableData.slice(1).map((row, idx) => (
          <Tr key={idx}>
            {row.map((cell, cellIdx) => <Td key={cellIdx}>{cell}</Td>)}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8}>
        <Text fontSize="2xl" fontWeight="bold">CSV Data Splitter</Text>
        <Text>Upload a CSV file and view it split into separate tables based on empty rows.</Text>
        <Input type="file" accept=".csv" onChange={handleFileUpload} />
        {tables.length > 0 && (
          <Box w="full">
            {tables.map((table, index) => renderTable(table, index))}
          </Box>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
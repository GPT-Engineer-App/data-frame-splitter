import { Container, Table, Thead, Tbody, Tr, Th, Td, Input, VStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import Papa from "papaparse";

const Index = () => {
  const [data, setData] = useState([]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          setData(results.data);
        },
        header: true,
        skipEmptyLines: true,
      });
    }
  };

  return (
    <Container centerContent maxW="container.xl" py={8}>
      <VStack spacing={4} width="100%">
        <Text fontSize="2xl" mb={4}>Upload a CSV File</Text>
        <Input type="file" accept=".csv" onChange={handleFileChange} p={2} />
        {data.length > 0 && (
          <Table variant="simple" size="sm" mt={4}>
            <Thead>
              <Tr>
                {Object.keys(data[0]).map((header, index) => (
                  <Th key={index}>{header}</Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {data.map((row, index) => (
                <Tr key={index}>
                  {Object.values(row).map((value, idx) => (
                    <Td key={idx}>{value}</Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
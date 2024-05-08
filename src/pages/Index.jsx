import { Container, VStack, Text, Button, Input, useToast } from "@chakra-ui/react";
import { useState } from "react";
import Papa from "papaparse";

const Index = () => {
  const [data, setData] = useState([]);
  const toast = useToast();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          setData(results.data);
          toast({
            title: "File loaded",
            description: "CSV data has been loaded successfully.",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
        },
        header: false,
        skipEmptyLines: true,
      });
    }
  };

  return (
    <Container centerContent maxW="container.md" height="100vh" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <VStack spacing={4}>
        <Text fontSize="2xl" mb={4}>Upload and Display CSV Data</Text>
        <Input type="file" accept=".csv" onChange={handleFileChange} p={2} />
        {data.length > 0 && (
          <VStack spacing={2} align="start" mt={4}>
            {data.map((row, index) => (
              <Text key={index} fontSize="sm">{row.join(', ')}</Text>
            ))}
          </VStack>
        )}
      </VStack>
    </Container>
  );
};

export default Index;
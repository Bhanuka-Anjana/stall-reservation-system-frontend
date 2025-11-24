"use client";

import { Flex, Text, Button, Container, Heading, Box } from "@radix-ui/themes";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return (
      <Container size="4" p="4">
        <Dashboard />
      </Container>
    );
  }
  return (
    <Container size="3">
      <Flex direction="column" align="center" justify="center" style={{ minHeight: '80vh' }} gap="6">
        <Box style={{ textAlign: 'center' }}>
          <Heading size="9" mb="4">Bookfair Management System</Heading>
          <Text size="5" color="gray">
            Streamline your book fair experience. Manage stalls, reservations, and more.
          </Text>
        </Box>

        <Flex gap="4" mt="4">
          <Link href="/reservations">
            <Button size="4" variant="solid" style={{ cursor: 'pointer' }}>
              View Reservations
            </Button>
          </Link>
          <Link href="/register">
            <Button size="4" variant="outline" style={{ cursor: 'pointer' }}>
              Register Now
            </Button>
          </Link>
        </Flex>
      </Flex>
    </Container>
  );
}

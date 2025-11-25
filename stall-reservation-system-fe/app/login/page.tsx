"use client";

import { Flex, Text, TextField, Button, Card, Container } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("https://fluffy-train-xqwq79vrw7x29qpx-8080.app.github.dev/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usernameOrEmail: email, password }),
      });

      const data = await response.json();
      console.log(data);

      if (data.success) {
        toast.success("Login successful!");
        login(data.data.token, data.data);
        router.push('/');
      } else {
        toast.error(data.message || "Login failed. Please check your credentials.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container size="1">
      <Flex direction="column" align="center" justify="center" style={{ minHeight: '80vh' }}>
        <Card size="4" style={{ width: '100%' }}>
          <form onSubmit={handleLogin}>
            <Flex direction="column" gap="4">
              <Text size="6" weight="bold" align="center">Login</Text>
<<<<<<< main
              
=======

>>>>>>> main
              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Email</Text>
                <TextField.Root placeholder="Enter your email" type="email" name="email" required />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Password</Text>
                <TextField.Root placeholder="Enter your password" type="password" name="password" required />
              </Flex>

              <Button size="3" type="submit" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </Button>

              <Text size="2" align="center">
                Don't have an account? <Link href="/register" style={{ color: 'var(--accent-9)' }}>Register</Link>
              </Text>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}

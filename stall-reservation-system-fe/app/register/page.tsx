
"use client";

import { Flex, Text, TextField, Button, Card, Container, Select } from "@radix-ui/themes";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function RegisterPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!fullName || !email || !phoneNumber || !companyName || !password || !confirmPassword) {
      toast.error("All fields are required.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      setLoading(false);
      return;
    }
    const data = await response.json();
      console.log(data);
      if (data.success) {
        toast.success("Registration successful!");
        login(data.data.token, data.data);
        router.push('/');
      } else {
        // Display the specific error message from the backend (e.g., weak password, existing email)
        toast.error(data.data || "Registration failed. Please try again.");
      }
    } catch (err) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
    <Flex direction="column" gap="4">
              <Text size="6" weight="bold" align="center">Register</Text>
              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Full Name</Text>
                <TextField.Root placeholder="Enter your name" name="fullName" required />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Email</Text>
                <TextField.Root placeholder="Enter your email" type="email" name="email" required />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Phone Number</Text>
                <TextField.Root placeholder="+94771234570" type="tel" name="phoneNumber" required />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Company Name</Text>
                <TextField.Root placeholder="Enter company name" name="companyName" required />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Role</Text>
                <Select.Root defaultValue="VENDOR" name="role">
                  <Select.Trigger />
                  <Select.Content>
                    <Select.Item value="VENDOR">Vendor</Select.Item>
                    <Select.Item value="PUBLISHER">Publisher</Select.Item>
                  </Select.Content>
                </Select.Root>
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Password</Text>
                <TextField.Root placeholder="Create a password" type="password" name="password" required />
              </Flex>

              <Flex direction="column" gap="2">
                <Text size="2" weight="bold">Re-enter Password</Text>
                <TextField.Root placeholder="Confirm your password" type="password" name="confirmPassword" required />
              </Flex>

              <Button size="3" type="submit" mt="2" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>

              <Text size="2" align="center">
                Already have an account? <Link href="/login" style={{ color: 'var(--accent-9)' }}>Login</Link>
              </Text>
            </Flex>
          </form>
        </Card>
      </Flex>
    </Container>
  );
}

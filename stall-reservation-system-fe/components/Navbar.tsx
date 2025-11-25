"use client";
// fix the position
import { Flex, Text, Button, Box, Avatar } from "@radix-ui/themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { PersonIcon } from "@radix-ui/react-icons";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <Box style={{ 
      borderBottom: '1px solid var(--gray-5)', 
      padding: '1rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--color-background)'
    }}>
      <Flex justify="between" align="center">
        <Flex align="baseline" gap="3">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Text size="6" weight="bold">BookNexus</Text>
          </Link>
          <Text size="3" weight="light" color="gray">powered by Sri Lanka Book Publishers’ Association</Text>
        </Flex>

        <Flex gap="4" align="center">
          <Link href="/">
            <Button variant={pathname === '/' ? 'solid' : 'ghost'}>
              Dashboard
            </Button>
          </Link>

          <Link href="/events">
            <Button variant={pathname === '/events' ? 'solid' : 'ghost'}>
              Events
            </Button>
          </Link>
          
          {!isAuthenticated ? (
            <>
              <Link href="/login">
                <Button variant={pathname === '/login' ? 'solid' : 'ghost'}>
                  Login
                </Button>
              </Link>

              <Link href="/register">
                <Button variant={pathname === '/register' ? 'solid' : 'ghost'}>
                  Register
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Flex align="center" gap="2">
                <PersonIcon />
                <Text weight="medium">{user?.fullName || user?.username}</Text>
              </Flex>
              <Button color="red" variant="soft" onClick={logout}>
                Log out
              </Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  );
}

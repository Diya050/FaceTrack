import {
    Card,
    CardContent,
    CardMedia,
    Typography,
    Box,
    Link,
} from "@mui/material";

interface Props {
    name: string;
    role: string;
    description: string;
    image: string;
    linkedin: string;
    email: string;
}

export default function TeamMemberCard({
    name,
    role,
    description,
    image,
    linkedin,
    email,
}: Props) {
    return (
        <Card
            sx={{
                height: "100%",
                borderRadius: 4,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.25s ease, box-shadow 0.25s ease",
                "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: 6,
                },
            }}
        >
            <Box position="relative">
                <CardMedia
                    component="img"
                    image={image}
                    alt={name}
                    sx={{
                        height: 300,
                        objectFit: "cover",
                        objectPosition: "center",
                    }}
                />

                <Box
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        borderRadius: 3,
                        px: 2.5,
                        py: 1,
                        textAlign: "center",
                        minWidth: "70%",
                    }}
                >
                    <Typography fontWeight={600} lineHeight={1.2}>
                        {name}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                    >
                        {role}
                    </Typography>
                </Box>
            </Box>

            <CardContent sx={{ flexGrow: 1, pt: 2 }}>
                <Typography variant="body2" mb={2}>
                    {description}
                </Typography>

                <Box display="flex" gap={2}>
                    <Link
                        href={linkedin}
                        target="_blank"
                        underline="hover"
                        fontWeight={500}
                    >
                        LinkedIn
                    </Link>

                    <Link
                        href={`mailto:${email}`}
                        underline="hover"
                        fontWeight={500}
                    >
                        Email
                    </Link>
                </Box>
            </CardContent>
        </Card>
    );
}
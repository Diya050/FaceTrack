import { useEffect } from "react";
import { Typography, Box, Grid, Container } from "@mui/material";
import TeamMemberCard from "../components/team/TeamMemberCard";

interface Member {
  name: string;
  role: string;
  image: string;
  linkedin: string;
  email: string;
}

const developers: Member[] = [
  {
    name: "Priyansh Agarwal",
    role: "Programmer Analyst Intern · Argusoft",
    image: "/team/dev1.jpg",
    linkedin: "https://www.linkedin.com/in/priyansh-agarwal-2517b1252/",
    email: "priyanshagarwal0704@gmail.com",
  },
  {
    name: "Komal Sharma",
    role: "Programmer Analyst Intern · Argusoft",
    image: "/team/dev2.jpg",
    linkedin: "https://linkedin.com/",
    email: "ks9421032@gmail.com",
  },
  {
    name: "Mridul Hemrajani",
    role: "Programmer Analyst Intern · Argusoft",
    image: "/team/dev3.jpg",
    linkedin: "https://www.linkedin.com/in/mridul-hemrajani-450774289/",
    email: "2022511920.mridul@ug.sharda.ac.in",
  },
  {
    name: "Dhruvit Garathiya",
    role: "Programmer Analyst Intern · Argusoft",
    image: "/team/dev4.jpg",
    linkedin: "https://www.linkedin.com/in/dhruvit-garathiya-gec-ldce-it-dte/",
    email: "dhruvitwork158@gmail.com",
  },
  {
    name: "Diya Baweja",
    role: "Programmer Analyst Intern · Argusoft",
    image: "/team/dev5.jpg",
    linkedin: "https://www.linkedin.com/in/diya-baweja",
    email: "diyabaweja8686@gmail.com",
  },
  {
    name: "Prachi Singh",
    role: "Programmer Analyst Intern · Argusoft",
    image: "/team/dev6.jpg",
    linkedin: "https://www.linkedin.com/in/praxhi-singh",
    email: "prachi100903@gmail.com",
  },
  {
    name: "Pranjal Amulani",
    role: "Programmer Analyst Intern · Argusoft",
    image: "/team/dev7.jpg",
    linkedin: "https://www.linkedin.com/in/pranjal-amulani-213b172a9/",
    email: "pranjalamulani9@gmail.com",
  },
];

const mentors: Member[] = [
  {
    name: "Harsh Trambadiya",
    role: "Solution Analyst · Argusoft",
    image: "/team/mentor1.jpg",
    linkedin: "https://www.linkedin.com/in/harshtrambadia02/",
    email: "htrambadia@argusoft.com",
  },
  {
    name: "Nandani Thumar",
    role: "Solution Analyst · Argusoft",
    image: "/team/mentor2.jpg",
    linkedin: "https://www.linkedin.com/in/nandani-thumar/",
    email: "nthumar@argusoft.com",
  },
];

export default function MeetOurTeam() {
  useEffect(() => {
    document.title = "Meet Our Team | FaceTrack";
  }, []);
  return (
    <Box sx={{ backgroundColor: "#F0F0DB", minHeight: "100vh" }}>
      <Box
        sx={{
          background: "linear-gradient(135deg, #1e2336, #30364F, #424a6b)",
          py: { xs: 8, md: 10 },
          textAlign: "center",
        }}
      >
        <Typography variant="h3" fontWeight={800} color="#F0F0DB" mb={2}>
          Meet Our Team
        </Typography>

        <Typography
          color="#ACBAC4"
          maxWidth={600}
          mx="auto"
          fontSize="1.1rem"
        >
          The people behind FaceTrack, building secure and intelligent attendance
          solutions.
        </Typography>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
        <Typography variant="h5" fontWeight={700} color="#30364F" mb={4}>
          Development Team
        </Typography>

        <Grid container spacing={4} mb={8}>
          {developers.map((member, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <TeamMemberCard {...member} />
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" fontWeight={700} color="#30364F" mb={4}>
          Mentors
        </Typography>

        <Grid container spacing={4}>
          {mentors.map((member, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <TeamMemberCard {...member} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
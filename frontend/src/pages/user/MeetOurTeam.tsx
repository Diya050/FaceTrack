import {
  Typography,
  Box,
  Grid,
  Container,
} from "@mui/material";
import TeamMemberCard from "../../components/team/TeamMemberCard";

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
  return (
    <Box py={{ xs: 4, md: 6 }}>
      <Container maxWidth="lg">
        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          mb={{ xs: 2, md: 4 }}
        >
          Meet Our Team
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          textAlign="center"
          mb={{ xs: 4, md: 6 }}
        >
          A passionate team of developers building FaceTrack under expert mentorship at Argusoft.
        </Typography>

        <Typography variant="h5" fontWeight={600} mb={3}>
          Development Team
        </Typography>

        <Grid container spacing={4} mb={8}>
          {developers.map((member, index) => (
            <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
              <TeamMemberCard {...member} />
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" fontWeight={600} mb={3}>
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
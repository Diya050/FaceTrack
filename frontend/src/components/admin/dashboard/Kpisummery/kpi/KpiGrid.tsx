import { Grid } from "@mui/material";
import KpiCard from "./KpiCard";
import type { KpiCardData } from "../../../../../types/dashboard.types";

interface Props {
  cards: KpiCardData[];
}

export default function KpiGrid({ cards }: Props) {
  return (
    <Grid container spacing={3}>
      {cards.map((card) => (
        <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
          <KpiCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}
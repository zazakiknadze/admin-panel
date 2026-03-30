import {
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  Box,
  Avatar,
  Button,
} from "@mui/material";
import { useLeaderboardDetails } from "./hooks/useLeaderboardDetails";
import { useNavigate, useParams } from "react-router-dom";
import {
  Leaderboard,
  LeaderboardPrize,
  LeaderboardStatus,
} from "@/interfaces/leaderboard";
import {
  EmojiEvents as EmojiEventsIcon,
  CalendarMonth as CalendarIcon,
  InfoOutlined as InfoIcon,
  Groups as GroupsIcon,
  ArrowBack as BackIcon,
  SportsScore as SportsScoreIcon,
} from "@mui/icons-material";
import StateHandler from "@/components/stateHandler/stateHandler";

const LeaderboardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useLeaderboardDetails(
    id as string,
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case LeaderboardStatus.COMPLETED:
        return "success";
      case LeaderboardStatus.ACTIVE:
        return "success";
      case LeaderboardStatus.DRAFT:
        return "warning";
      default:
        return "default";
    }
  };

  const Row = ({
    label,
    value,
    icon,
  }: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }) => (
    <Grid item xs={12} sm={6} md={4}>
      <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
        {icon && (
          <Box sx={{ color: "text.secondary", display: "flex" }}>{icon}</Box>
        )}
        <Typography
          variant="caption"
          fontWeight={700}
          sx={{
            color: "text.secondary",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          {label}
        </Typography>
      </Stack>
      <Typography
        variant="body1"
        fontWeight={500}
        sx={{ color: "text.primary", pl: icon ? 4 : 0 }}
      >
        {value || "-"}
      </Typography>
    </Grid>
  );

  return (
    <StateHandler
      data={data}
      isLoading={isLoading}
      error={error}
      resetErrorBoundary={() => refetch()}
    >
      {(data: Leaderboard) => (
        <Box sx={{ minHeight: "100%", py: 6 }}>
          <Card
            sx={{
              maxWidth: 900,
              mx: "auto",
              borderRadius: 4,
              boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
              overflow: "visible",
            }}
          >
            <Box
              sx={{
                p: 4,
                borderRadius: "16px 16px 0 0",
                background: "#e7e7e7",
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  onClick={() => navigate("/leaderboard")}
                  startIcon={<BackIcon sx={{ fontSize: "14px !important" }} />}
                  sx={{
                    color: "text.secondary",
                    textTransform: "none",
                    p: 0,
                    mb: 3,
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "green",
                      bgcolor: "transparent",
                      transform: "translateX(-4px)",
                    },
                  }}
                >
                  Back to Leaderboard
                </Button>
                <Button
                  onClick={() => navigate(`/leaderboard/${data.id}/edit`)}
                  sx={{
                    color: "text.secondary",
                    textTransform: "none",
                    p: 0,
                    mb: 2,
                    minWidth: "auto",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    transition: "all 0.2s ease",
                    "&:hover": {
                      color: "green",
                      bgcolor: "transparent",
                    },
                  }}
                >
                  Edit
                </Button>
              </Box>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={2}
              >
                <Box>
                  <Typography
                    variant="h4"
                    fontWeight={800}
                    gutterBottom
                    sx={{ color: "green" }}
                  >
                    {data.title}
                  </Typography>
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ maxWidth: "600px" }}
                  >
                    {data.description}
                  </Typography>
                </Box>
                <Chip
                  label={data.status}
                  color={getStatusColor(data.status)}
                  variant="filled"
                  sx={{ fontWeight: 700, px: 1 }}
                />
              </Stack>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 0.5,
                }}
              >
                <Typography color="text.secondary">ID:</Typography>
                <Typography fontWeight={500}>{data.id}</Typography>
              </Box>
            </Box>

            <CardContent sx={{ p: 4 }}>
              <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
                display="flex"
                alignItems="center"
                gap={1}
              >
                <InfoIcon sx={{ color: "green" }} /> Leaderboard Details
              </Typography>

              <Grid container spacing={4} mb={4}>
                <Row
                  label="Start Date"
                  value={data.startDate}
                  icon={<CalendarIcon fontSize="small" />}
                />
                <Row
                  label="End Date"
                  value={data.endDate}
                  icon={<CalendarIcon fontSize="small" />}
                />
                <Row
                  label="Scoring"
                  value={data.scoringType}
                  icon={<SportsScoreIcon fontSize="small" />}
                />
                <Row
                  label="Created"
                  value={data.createdAt}
                  icon={<CalendarIcon fontSize="small" />}
                />
                <Row
                  label="Updated At"
                  value={data.updatedAt}
                  icon={<CalendarIcon fontSize="small" />}
                />
                <Row
                  label="Max Capacity"
                  value={data.maxParticipants}
                  icon={<GroupsIcon fontSize="small" />}
                />
              </Grid>

              <Divider sx={{ my: 4, opacity: 0.6 }} />

              <Typography
                variant="h6"
                fontWeight={700}
                mb={3}
                display="flex"
                alignItems="center"
                gap={1.5}
              >
                <Avatar sx={{ bgcolor: "green", width: 32, height: 32 }}>
                  <EmojiEventsIcon sx={{ fontSize: 20 }} />
                </Avatar>
                Prizes Pool
              </Typography>

              <Stack spacing={2.5}>
                {data.prizes.map((prize: LeaderboardPrize) => (
                  <Paper
                    key={prize.id}
                    elevation={0}
                    sx={{
                      p: 3,
                      borderRadius: 3,
                      background: "#fff",
                      border: "1px solid #f0f0f0",
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                      },
                      borderLeft: "5px solid",
                      borderLeftColor: "green",
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={2}>
                        <Typography
                          variant="caption"
                          color="green"
                          fontWeight={700}
                          display="block"
                        >
                          RANK
                        </Typography>
                        <Typography variant="h5" fontWeight={900} color="green">
                          #{prize.rank}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          PRIZE NAME
                        </Typography>
                        <Typography variant="body1" fontWeight={700}>
                          {prize.name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={3}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          TYPE
                        </Typography>
                        <Chip
                          label={prize.type}
                          size="small"
                          variant="outlined"
                          sx={{
                            mt: 0.5,
                            fontWeight: 600,
                            color: "text.primary",
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} md={3} sx={{ textAlign: "right" }}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          REWARD
                        </Typography>
                        <Typography variant="h6" fontWeight={800} color="green">
                          {prize.amount}
                        </Typography>
                      </Grid>

                      <Grid item xs={12}>
                        <Divider
                          sx={{ my: 1, borderStyle: "dashed", opacity: 0.5 }}
                        />
                      </Grid>

                      <Grid item xs={12} md={5}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          PRIZE ID
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            fontFamily: "monospace",
                            color: "text.primary",
                          }}
                        >
                          {prize.id}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} md={7}>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          IMAGE URL
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: prize.imageUrl
                              ? "primary.main"
                              : "text.disabled",
                            wordBreak: "break-all",
                            fontStyle: prize.imageUrl ? "normal" : "italic",
                          }}
                        >
                          {prize.imageUrl || "-"}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}
    </StateHandler>
  );
};

export default LeaderboardDetail;

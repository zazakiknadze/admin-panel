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
import { useWheelDetails } from "@/pages/wheel/hooks/useWheelDetails";
import { useNavigate, useParams } from "react-router-dom";
import {
  EmojiEvents as EmojiEventsIcon,
  CalendarMonth as CalendarIcon,
  InfoOutlined as InfoIcon,
  Groups as GroupsIcon,
  ArrowBack as BackIcon,
  ColorLens as ColorLensIcon,
  CurrencyExchange as CurrencyExchangeIcon,
} from "@mui/icons-material";
import StateHandler from "@/components/stateHandler/stateHandler";
import { WheelStatus } from "@/interfaces/wheel";
import { Wheel } from "@/interfaces/wheel";
import { WheelSegment } from "@/interfaces/wheel";
import { WheelPreview } from "@/pages/wheel/wheelPreview";

const WheelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useWheelDetails(id as string);

  const getStatusColor = (status: string) => {
    switch (status) {
      case WheelStatus.ACTIVE:
        return "success";
      case WheelStatus.DRAFT:
        return "warning";
      case WheelStatus.INACTIVE:
        return "error";
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
      {(data: Wheel) => (
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
                  onClick={() => navigate("/wheel")}
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
                  Back to Wheel
                </Button>
                <Button
                  onClick={() => navigate(`/wheel/${data.id}/edit`)}
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
                    {data.name}
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
                <InfoIcon sx={{ color: "green" }} /> Wheel Details
              </Typography>

              <Grid container spacing={4} mb={4}>
                <Row
                  label="Created At"
                  value={data.createdAt}
                  icon={<CalendarIcon fontSize="small" />}
                />
                <Row
                  label="Updated At"
                  value={data.updatedAt}
                  icon={<CalendarIcon fontSize="small" />}
                />
                <Row
                  label="Max Spins Per User"
                  value={data.maxSpinsPerUser}
                  icon={<GroupsIcon fontSize="small" />}
                />
                <Row
                  label="Spin Cost"
                  value={data.spinCost}
                  icon={<CurrencyExchangeIcon fontSize="small" />}
                />
                <Row
                  label="Background Color"
                  value={data.backgroundColor}
                  icon={
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: data.backgroundColor,
                        borderRadius: "50%",
                      }}
                    />
                  }
                />
                <Row
                  label="Border Color"
                  value={data.borderColor}
                  icon={
                    <Box
                      sx={{
                        width: 20,
                        height: 20,
                        bgcolor: data.borderColor,
                        borderRadius: "50%",
                      }}
                    />
                  }
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
                  <ColorLensIcon sx={{ fontSize: 20 }} />
                </Avatar>
                Segments
              </Typography>

              <Stack spacing={3} sx={{ mt: 4 }}>
                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    color: "text.primary",
                    "&::after": {
                      content: '""',
                      flex: 1,
                      height: "1px",
                      bgcolor: "divider",
                    },
                  }}
                >
                  <ColorLensIcon sx={{ color: "success.main" }} /> Wheel
                  Segments
                </Typography>

                <Grid container spacing={3}>
                  <Grid item xs={12} lg={8}>
                    <Stack spacing={2}>
                      {data.segments.map(
                        (segment: WheelSegment, index: number) => (
                          <Paper
                            key={segment.id}
                            elevation={0}
                            sx={{
                              p: 2.5,
                              borderRadius: 4,
                              border: "1px solid",
                              borderColor: "divider",
                              position: "relative",
                              overflow: "hidden",
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                borderColor: "success.light",
                                boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)",
                                transform: "scale(1.01)",
                              },
                            }}
                          >
                            <Box
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                bottom: 0,
                                width: 6,
                                bgcolor: segment.color || "grey.300",
                              }}
                            />

                            <Grid container alignItems="center" spacing={2}>
                              <Grid item xs={12} sm={4}>
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  spacing={2}
                                >
                                  <Typography
                                    variant="h6"
                                    sx={{
                                      bgcolor: "action.hover",
                                      width: 32,
                                      height: 32,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      borderRadius: 1.5,
                                      fontSize: "0.875rem",
                                      fontWeight: 800,
                                      color: "text.secondary",
                                    }}
                                  >
                                    {index + 1}
                                  </Typography>
                                  <Box>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      fontWeight={600}
                                      sx={{
                                        textTransform: "uppercase",
                                        letterSpacing: 1,
                                      }}
                                    >
                                      Label
                                    </Typography>
                                    <Typography
                                      variant="h6"
                                      fontWeight={700}
                                      noWrap
                                    >
                                      {segment.label}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </Grid>

                              <Grid item xs={6} sm={3}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  fontWeight={600}
                                >
                                  AMOUNT
                                </Typography>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                >
                                  <Typography variant="body1" fontWeight={700}>
                                    {segment.prizeAmount}
                                  </Typography>
                                  <Chip
                                    label={segment.prizeType}
                                    size="small"
                                    color="success"
                                    sx={{
                                      fontWeight: 700,
                                      fontSize: "0.65rem",
                                      height: 20,
                                    }}
                                  />
                                </Stack>
                              </Grid>

                              <Grid item xs={6} sm={3}>
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  fontWeight={600}
                                >
                                  WEIGHT
                                </Typography>
                                <Typography
                                  variant="body1"
                                  fontWeight={700}
                                  color="success.main"
                                >
                                  {segment.weight}
                                </Typography>
                              </Grid>

                              <Grid
                                item
                                xs={12}
                                sm={2}
                                sx={{ textAlign: { sm: "right" } }}
                              >
                                <Typography
                                  variant="caption"
                                  color="text.secondary"
                                  display="block"
                                >
                                  COLOR
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    fontFamily: "monospace",
                                    bgcolor: "action.hover",
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1,
                                    fontWeight: 600,
                                  }}
                                >
                                  {segment.color.toUpperCase()}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Paper>
                        ),
                      )}
                    </Stack>
                  </Grid>

                  <Grid item xs={12} lg={4}>
                    <Box sx={{ position: "sticky", top: 24 }}>
                      <Paper
                        elevation={0}
                        sx={{
                          p: 4,
                          borderRadius: 5,
                          bgcolor: "background.paper",
                          border: "1px solid",
                          borderColor: "divider",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          background:
                            "linear-gradient(145deg, #ffffff 0%, #f9fbf9 100%)",
                        }}
                      >
                        <Typography
                          variant="subtitle1"
                          fontWeight={800}
                          gutterBottom
                        >
                          Live Visualization
                        </Typography>

                        <Box sx={{ position: "relative", my: 2 }}>
                          <WheelPreview segments={data.segments} size={200} />
                        </Box>
                      </Paper>
                    </Box>
                  </Grid>
                </Grid>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      )}
    </StateHandler>
  );
};

export default WheelDetail;

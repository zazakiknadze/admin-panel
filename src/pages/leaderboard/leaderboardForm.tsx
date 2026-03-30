import { useForm, Controller, useFieldArray } from "react-hook-form";
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Paper,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  EmojiEvents as TrophyIcon,
  Settings as SettingsIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";
import {
  Leaderboard,
  LeaderboardPrizeType,
  LeaderboardScoringType,
  LeaderboardStatus,
} from "@/interfaces/leaderboard";
import { useEffect } from "react";
import { FormMode } from "@/interfaces/shared";
import { useLeaderboardDetails } from "@/pages/leaderboard/hooks/useLeaderboardDetails";
import { useNavigate, useParams } from "react-router-dom";
import StateHandler from "@/components/stateHandler/stateHandler";
import {
  useNewRowMutation,
  useUpdateRowMutation,
} from "@/pages/leaderboard/hooks/useRowMutation";
import { leaderboardSchema } from "@/pages/leaderboard/validations/validationSchema";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

interface Props {
  mode: FormMode;
}

export const LeaderboardForm = ({ mode }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useLeaderboardDetails(
    id as string,
  );

  const { mutateAsync: createLeaderboard, isPending: isCreating } =
    useNewRowMutation();

  const { mutateAsync: updateLeaderboard, isPending: isUpdating } =
    useUpdateRowMutation();

  const {
    control,
    getValues,
    reset,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<Leaderboard>({
    mode: "onChange",
    defaultValues: {
      id: "",
      title: "",
      description: "",
      startDate: "",
      endDate: "",
      status: undefined,
      scoringType: undefined,
      maxParticipants: undefined,
      prizes: [],
      createdAt: "",
      updatedAt: "",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prizes",
  });

  const scoringOptions = Object.values(LeaderboardScoringType);
  const prizeTypeOptions = Object.values(LeaderboardPrizeType);

  const handleFormSubmit = async (formData: Leaderboard) => {
    clearErrors();

    const result = leaderboardSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".");
        setError(path as unknown as keyof Leaderboard, {
          type: "manual",
          message: issue.message,
        });
      });
      return;
    }

    try {
      if (mode === FormMode.EDIT && id) {
        await updateLeaderboard({ id, data: formData });
        console.log("Successfully updated!");
      } else {
        await createLeaderboard(formData);
        console.log("Successfully created!");
      }
      navigate("/leaderboard");
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (mode === FormMode.EDIT && data) {
      reset(data);
    }
  }, [data, reset, mode]);

  useUnsavedChanges(isDirty);

  return (
    <StateHandler
      data={mode === FormMode.EDIT ? data : undefined}
      isLoading={isLoading}
      error={error}
      resetErrorBoundary={() => refetch()}
      isCreateForm={mode === FormMode.CREATE}
    >
      {() => (
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            handleFormSubmit(getValues());
          }}
          sx={{ maxWidth: 1000, margin: "0 auto", p: { xs: 2, md: 4 } }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Button
              onClick={() => navigate("/leaderboard")}
              startIcon={<BackIcon sx={{ fontSize: "14px !important" }} />}
              sx={{
                color: "text.secondary",
                textTransform: "none",
                p: 0,
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
          </Box>

          <Card
            elevation={0}
            sx={{ border: "1px solid #e0e0e0", borderRadius: 3 }}
          >
            <CardContent sx={{ p: 4 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={4}
              >
                <Box>
                  <Typography
                    variant="h4"
                    sx={{ color: "green", fontWeight: 700 }}
                  >
                    {mode === FormMode.EDIT
                      ? "Edit Leaderboard"
                      : "Create Leaderboard"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure your competition details and rewards
                  </Typography>
                </Box>
                <SettingsIcon sx={{ color: "green", fontSize: 40 }} />
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Controller
                    name="title"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Leaderboard Title"
                        fullWidth
                        variant="outlined"
                        error={!!errors.title}
                        helperText={errors.title?.message}
                        onChange={(e) => {
                          field.onChange(e);
                          if (errors.title) clearErrors("title");
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="status"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                          {...field}
                          value={field.value ?? ""}
                          label="Status"
                          error={!!errors.status}
                        >
                          {Object.values(LeaderboardStatus).map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        error={!!errors.description}
                        helperText={errors.description?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="startDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="date"
                        label="Start Date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.startDate}
                        helperText={errors.startDate?.message}
                        onChange={(e) => {
                          field.onChange(e);
                          if (errors.startDate) clearErrors("startDate");
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="endDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="date"
                        label="End Date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.endDate}
                        helperText={errors.endDate?.message}
                        onChange={(e) => {
                          field.onChange(e);
                          if (errors.endDate) clearErrors("endDate");
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="maxParticipants"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Max Participants"
                        fullWidth
                        error={!!errors.maxParticipants}
                        helperText={errors.maxParticipants?.message}
                        value={field.value ?? ""}
                        onChange={(e) => {
                          field.onChange(e);
                          if (errors.maxParticipants)
                            clearErrors("maxParticipants");
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="scoringType"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel>Scoring Type</InputLabel>
                        <Select
                          {...field}
                          value={field.value ?? ""}
                          label="Scoring Type"
                        >
                          <MenuItem value="">
                            <em>Select scoring type</em>
                          </MenuItem>
                          {scoringOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography
                      variant="overline"
                      color="text.secondary"
                      sx={{ fontWeight: 600 }}
                    >
                      Reward Distribution
                    </Typography>
                  </Divider>
                </Grid>

                <Grid item xs={12}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                  >
                    <Stack direction="row" spacing={1} alignItems="center">
                      <TrophyIcon color="success" />
                      <Typography variant="h6" fontWeight={600}>
                        Prizes
                      </Typography>
                    </Stack>

                    {errors.prizes && !Array.isArray(errors.prizes) && (
                      <Typography
                        color="error"
                        variant="caption"
                        sx={{ mb: 1, display: "block" }}
                      >
                        {errors.prizes.message}
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      color="success"
                      startIcon={<AddIcon />}
                      sx={{ borderRadius: 2 }}
                      onClick={() => {
                        clearErrors("prizes");
                        append({
                          id: crypto.randomUUID(),
                          rank: fields.length + 1,
                          name: "",
                          type: LeaderboardPrizeType.COINS,
                          amount: 0,
                          imageUrl: "",
                        });
                      }}
                    >
                      Add Prize
                    </Button>
                  </Box>

                  <Stack spacing={2}>
                    {fields.map((item, index) => (
                      <Paper
                        key={item.id}
                        variant="outlined"
                        sx={{
                          p: 3,
                          borderRadius: 2,
                          bgcolor: "#fafafa",
                          position: "relative",
                          transition: "0.2s",
                          "&:hover": { borderColor: "green" },
                        }}
                      >
                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          mb={2}
                        >
                          <Typography
                            variant="subtitle2"
                            sx={{ color: "green", fontWeight: 700 }}
                          >
                            REWARD POSITION #{index + 1}
                          </Typography>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => remove(index)}
                            sx={{
                              bgcolor: "#fff",
                              "&:hover": { bgcolor: "#fee" },
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <Controller
                              name={`prizes.${index}.name`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  label="Prize Name"
                                  fullWidth
                                  size="small"
                                  error={!!errors.prizes?.[index]?.name}
                                  helperText={
                                    errors.prizes?.[index]?.name?.message
                                  }
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={6} md={2}>
                            <Controller
                              name={`prizes.${index}.rank`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  type="number"
                                  label="Rank"
                                  fullWidth
                                  size="small"
                                  error={!!errors.prizes?.[index]?.rank}
                                  helperText={
                                    errors.prizes?.[index]?.rank?.message
                                  }
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={6} md={2}>
                            <Controller
                              name={`prizes.${index}.amount`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  type="number"
                                  label="Amount"
                                  fullWidth
                                  size="small"
                                  error={!!errors.prizes?.[index]?.amount}
                                  helperText={
                                    errors.prizes?.[index]?.amount?.message
                                  }
                                />
                              )}
                            />
                          </Grid>
                          <Grid item xs={12} md={4}>
                            <Controller
                              name={`prizes.${index}.type`}
                              control={control}
                              render={({ field }) => (
                                <FormControl fullWidth size="small">
                                  <InputLabel>Prize Type</InputLabel>
                                  <Select {...field} label="Prize Type">
                                    {prizeTypeOptions.map((option) => (
                                      <MenuItem key={option} value={option}>
                                        {option}
                                      </MenuItem>
                                    ))}
                                  </Select>
                                </FormControl>
                              )}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Controller
                              name={`prizes.${index}.imageUrl`}
                              control={control}
                              render={({ field }) => (
                                <Box
                                  display="flex"
                                  flexDirection="column"
                                  gap={1}
                                >
                                  <TextField
                                    {...field}
                                    label="Image URL"
                                    fullWidth
                                    error={!!errors.prizes?.[index]?.imageUrl}
                                    helperText={
                                      errors.prizes?.[index]?.imageUrl?.message
                                    }
                                  />

                                  {field.value && (
                                    <Box
                                      display="flex"
                                      alignItems="center"
                                      gap={1}
                                    >
                                      <Box
                                        component="img"
                                        src={field.value}
                                        alt="preview"
                                        sx={{
                                          width: 120,
                                          height: 120,
                                          objectFit: "cover",
                                          borderRadius: 1,
                                          border: "1px solid #ccc",
                                        }}
                                        onError={(e) => {
                                          e.currentTarget.style.display =
                                            "none";
                                        }}
                                      />
                                      <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ height: 40 }}
                                        onClick={() => field.onChange("")}
                                      >
                                        Remove Image
                                      </Button>
                                    </Box>
                                  )}
                                </Box>
                              )}
                            />
                          </Grid>
                        </Grid>
                      </Paper>
                    ))}
                  </Stack>
                </Grid>

                <Grid item xs={12} mt={2}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      bgcolor: "green",
                      fontWeight: 700,
                      fontSize: "1.1rem",
                      borderRadius: 2,
                      "&:hover": { bgcolor: "#006400" },
                    }}
                    disabled={isCreating || isUpdating}
                  >
                    {mode === FormMode.EDIT
                      ? "Save Changes"
                      : "Create Leaderboard"}
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      )}
    </StateHandler>
  );
};

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
  Settings as SettingsIcon,
  ArrowBack as BackIcon,
  Palette as PaletteIcon,
} from "@mui/icons-material";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FormMode } from "@/interfaces/shared";
import { Wheel, WheelSegmentPrizeType, WheelStatus } from "@/interfaces/wheel";
import StateHandler from "@/components/stateHandler/stateHandler";
import {
  useNewRowMutation,
  useUpdateRowMutation,
} from "@/pages/wheel/hooks/useRowMutation";
import { useWheelDetails } from "@/pages/wheel/hooks/useWheelDetails";
import { wheelSchema } from "@/pages/wheel/validations/validationSchema";
import { WheelPreview } from "@/pages/wheel/wheelPreview";
import { useUnsavedChanges } from "@/hooks/useUnsavedChanges";

interface Props {
  mode: FormMode;
}

export const WheelForm = ({ mode }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useWheelDetails(id as string);

  const { mutateAsync: createWheel, isPending: isCreating } =
    useNewRowMutation();
  const { mutateAsync: updateWheel, isPending: isUpdating } =
    useUpdateRowMutation();

  const {
    control,
    getValues,
    reset,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<Wheel>({
    defaultValues: {
      name: "",
      description: "",
      status: undefined,
      segments: [],
      maxSpinsPerUser: undefined,
      spinCost: undefined,
      backgroundColor: "#ffffff",
      borderColor: "#000000",
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "segments",
  });

  const handleFormSubmit = async (formData: Wheel) => {
    clearErrors();

    const cleanedData = {
      ...formData,
      segments: formData.segments.map((seg, idx) => ({
        ...seg,
        id: (idx + 1).toString(),
      })),
    };

    const result = wheelSchema.safeParse(cleanedData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        setError(issue.path.join(".") as keyof Wheel, {
          type: "manual",
          message: issue.message,
        });
      });
      return;
    }

    try {
      if (mode === FormMode.EDIT && id) {
        await updateWheel({ id, data: formData });
      } else {
        await createWheel(formData);
      }
      navigate("/wheel");
    } catch (err) {
      console.error(err);
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
          sx={{ maxWidth: 1100, margin: "0 auto", p: { xs: 2, md: 4 } }}
        >
          <Box>
            <Button
              onClick={() => navigate("/wheel")}
              startIcon={<BackIcon />}
              sx={{
                color: "text.secondary",
                textTransform: "none",
                fontWeight: 600,
                "&:hover": {
                  color: "green",
                  bgcolor: "transparent",
                  transform: "translateX(-4px)",
                },
                transition: "all 0.2s",
              }}
            >
              Back to Wheel List
            </Button>
          </Box>

          <Card
            elevation={0}
            sx={{ border: "1px solid #e0e0e0", borderRadius: 3, mb: 4 }}
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
                    {mode === FormMode.EDIT ? "Edit Wheel" : "Create Wheel"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure your wheel settings, visuals, and prize segments
                  </Typography>
                </Box>
                <SettingsIcon
                  sx={{ color: "green", fontSize: 40, opacity: 0.8 }}
                />
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Wheel Name"
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name?.message}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Controller
                      name="status"
                      control={control}
                      render={({ field }) => (
                        <Select
                          {...field}
                          label="Status"
                          value={field.value ?? ""}
                          error={!!errors.status}
                        >
                          {Object.values(WheelStatus).map((status) => (
                            <MenuItem key={status} value={status}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      )}
                    />
                  </FormControl>
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
                        rows={2}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={3}>
                  <Controller
                    name="maxSpinsPerUser"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Max Spins PerUser"
                        fullWidth
                        value={field.value ?? ""}
                        error={!!errors.maxSpinsPerUser}
                        helperText={errors.maxSpinsPerUser?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller
                    name="spinCost"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Spin Cost"
                        fullWidth
                        value={field.value ?? ""}
                        error={!!errors.spinCost}
                        helperText={errors.spinCost?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller
                    name="backgroundColor"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="color"
                        label="Background Color"
                        fullWidth
                        sx={{ "& input": { height: 30 } }}
                        error={!!errors.backgroundColor}
                        helperText={errors.backgroundColor?.message}
                      />
                    )}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <Controller
                    name="borderColor"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="color"
                        label="Border Color"
                        fullWidth
                        sx={{ "& input": { height: 30 } }}
                        error={!!errors.borderColor}
                        helperText={errors.borderColor?.message}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 5 }} />

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 600,
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <PaletteIcon color="success" /> Wheel Segments
                </Typography>

                {errors.segments?.message &&
                  typeof errors.segments.message === "string" && (
                    <Typography
                      color="error"
                      variant="caption"
                      sx={{ mb: 1, display: "block", fontWeight: "bold" }}
                    >
                      {errors.segments.message}
                    </Typography>
                  )}

                <Button
                  variant="contained"
                  color="success"
                  startIcon={<AddIcon />}
                  onClick={() =>
                    append({
                      id: crypto.randomUUID(),
                      label: "",
                      color:
                        "#" + Math.floor(Math.random() * 16777215).toString(16),
                      weight: 1,
                      prizeType: WheelSegmentPrizeType.NOTHING,
                      prizeAmount: 0,
                      imageUrl: "",
                    })
                  }
                  disabled={fields.length >= 12}
                >
                  Add Segment
                </Button>
              </Stack>

              <Stack spacing={3}>
                {fields.map((item, index) => (
                  <Paper
                    key={item.id}
                    elevation={0}
                    sx={{
                      p: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      transition: "0.2s",
                      "&:hover": {
                        borderColor: "green",
                        bgcolor: "rgba(0,128,0,0.02)",
                      },
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name={`segments.${index}.label`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Segment Label"
                              fullWidth
                              size="small"
                              error={!!errors.segments?.[index]?.label}
                              helperText={
                                errors.segments?.[index]?.label?.message
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Controller
                          name={`segments.${index}.color`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="color"
                              label="Color"
                              fullWidth
                              size="small"
                              error={!!errors.segments?.[index]?.color}
                              helperText={
                                errors.segments?.[index]?.color?.message
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Controller
                          name={`segments.${index}.imageUrl`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              label="Icon/Image URL"
                              fullWidth
                              size="small"
                              error={!!errors.segments?.[index]?.imageUrl}
                              helperText={
                                errors.segments?.[index]?.imageUrl?.message
                              }
                            />
                          )}
                        />
                      </Grid>

                      <Grid item xs={12} md={4}>
                        <FormControl fullWidth size="small">
                          <InputLabel>Prize Type</InputLabel>
                          <Controller
                            name={`segments.${index}.prizeType`}
                            control={control}
                            render={({ field }) => (
                              <Select
                                {...field}
                                label="Prize Type"
                                error={!!errors.segments?.[index]?.prizeType}
                              >
                                {Object.values(WheelSegmentPrizeType).map(
                                  (t) => (
                                    <MenuItem key={t} value={t}>
                                      {t}
                                    </MenuItem>
                                  ),
                                )}
                              </Select>
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Controller
                          name={`segments.${index}.prizeAmount`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              label="Amount"
                              fullWidth
                              size="small"
                              error={!!errors.segments?.[index]?.prizeAmount}
                              helperText={
                                errors.segments?.[index]?.prizeAmount?.message
                              }
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <Controller
                          name={`segments.${index}.weight`}
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              type="number"
                              label="Winning Weight"
                              fullWidth
                              size="small"
                              error={!!errors.segments?.[index]?.weight}
                              helperText={
                                errors.segments?.[index]?.weight?.message
                              }
                            />
                          )}
                        />
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={2}
                        sx={{
                          display: "flex",
                          justifyContent: "flex-end",
                          alignItems: "center",
                        }}
                      >
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
                      </Grid>
                    </Grid>
                  </Paper>
                ))}

                {fields.length > 1 && (
                  <WheelPreview segments={getValues("segments")} />
                )}
              </Stack>

              <Box mt={4}>
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
                  {mode === FormMode.EDIT ? "Save Changes" : "Create Wheel"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </StateHandler>
  );
};

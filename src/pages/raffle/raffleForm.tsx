import { useForm, Controller, useFieldArray } from 'react-hook-form';
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
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  EmojiEvents as TrophyIcon,
  Settings as SettingsIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { RafflePrizeType } from '@/interfaces/raffle';
import { useEffect, useState } from 'react';
import { FormMode } from '@/interfaces/shared';
import { useNavigate, useParams } from 'react-router-dom';
import StateHandler from '@/components/stateHandler/stateHandler';
import {
  useNewRowMutation,
  useUpdateRowMutation,
} from '@/pages/raffle/hooks/useRowMutation';
import { useRaffleDetails } from '@/pages/raffle/hooks/useRaffleDetails';
import { Raffle, RaffleStatus } from '@/interfaces/raffle';
import { raffleSchema } from '@/pages/raffle/validations/validationSchema';
import { useUnsavedChanges } from '@/hooks/useUnsavedChanges';

interface Props {
  mode: FormMode;
}

export const RaffleForm = ({ mode }: Props) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error, refetch } = useRaffleDetails(id as string);

  const { mutateAsync: createRaffle, isPending: isCreating } =
    useNewRowMutation();

  const { mutateAsync: updateRaffle, isPending: isUpdating } =
    useUpdateRowMutation();

  const {
    control,
    getValues,
    reset,
    setError,
    clearErrors,
    formState: { errors, isDirty },
  } = useForm<Raffle>({
    mode: 'onChange',
    defaultValues: {
      id: '',
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      drawDate: '',
      status: undefined,
      ticketPrice: undefined,
      maxTicketsPerUser: undefined,
      totalTicketLimit: null,
      prizes: [],
      createdAt: '',
      updatedAt: '',
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'prizes',
  });

  const prizeTypeOptions = Object.values(RafflePrizeType);

  const handleFormSubmit = async (formData: Raffle) => {
    clearErrors();
    setIsSubmitting(true);

    const result = raffleSchema.safeParse(formData);

    if (!result.success) {
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        setError(path as keyof Raffle, {
          type: 'manual',
          message: issue.message,
        });
      });
      return;
    }

    try {
      if (mode === FormMode.EDIT && id) {
        await updateRaffle({ id, data: formData });
        console.log('Successfully updated!');
      } else {
        await createRaffle(formData);
        console.log('Successfully created!');
      }
      navigate('/raffle');
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (data?.status === RaffleStatus.DRAWN) {
      navigate('/raffle');
    }
    if (mode === FormMode.EDIT && data) {
      reset(data);
    }
  }, [data, reset, mode]);

  useUnsavedChanges(isDirty, isSubmitting);

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
          sx={{ maxWidth: 1000, margin: '0 auto', p: { xs: 2, md: 4 } }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={() => navigate('/raffle')}
              startIcon={<BackIcon sx={{ fontSize: '14px !important' }} />}
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                p: 0,
                fontWeight: 600,
                fontSize: '0.95rem',
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: 'green',
                  bgcolor: 'transparent',
                  transform: 'translateX(-4px)',
                },
              }}
            >
              Back to Raffle
            </Button>
          </Box>

          <Card
            elevation={0}
            sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}
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
                    sx={{ color: 'green', fontWeight: 700 }}
                  >
                    {mode === FormMode.EDIT ? 'Edit Raffle' : 'Create Raffle'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Configure your raffle details and prizes
                  </Typography>
                </Box>
                <SettingsIcon sx={{ color: 'green', fontSize: 40 }} />
              </Stack>

              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        label="Raffle Name"
                        fullWidth
                        variant="outlined"
                        error={!!errors.name}
                        helperText={errors.name?.message}
                        onChange={(e) => {
                          field.onChange(e);
                          if (errors.name) clearErrors('name');
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
                          label="Status"
                          value={field.value ?? ''}
                          error={!!errors.status}
                        >
                          {Object.values(RaffleStatus).map((status) => (
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
                          if (errors.startDate) clearErrors('startDate');
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
                          if (errors.endDate) clearErrors('endDate');
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="drawDate"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="date"
                        label="Draw Date"
                        fullWidth
                        InputLabelProps={{ shrink: true }}
                        error={!!errors.drawDate}
                        helperText={errors.drawDate?.message}
                        onChange={(e) => {
                          field.onChange(e);
                          if (errors.drawDate) clearErrors('drawDate');
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="ticketPrice"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Ticket Price"
                        fullWidth
                        error={!!errors.ticketPrice}
                        helperText={errors.ticketPrice?.message}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e);
                          if (errors.ticketPrice) clearErrors('ticketPrice');
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="maxTicketsPerUser"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        type="number"
                        label="Max Tickets Per User"
                        fullWidth
                        error={!!errors.maxTicketsPerUser}
                        helperText={errors.maxTicketsPerUser?.message}
                        value={field.value ?? ''}
                        onChange={(e) => {
                          field.onChange(e);
                          if (errors.maxTicketsPerUser)
                            clearErrors('maxTicketsPerUser');
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <Controller
                    name="totalTicketLimit"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        value={
                          field.value === null || field.value === undefined
                            ? ''
                            : field.value
                        }
                        type="number"
                        label="Total Ticket Limit"
                        fullWidth
                        error={!!errors.totalTicketLimit}
                        helperText={errors.totalTicketLimit?.message}
                        onChange={(e) => {
                          const val = e.target.value;

                          if (val === '') {
                            field.onChange(null);
                          } else {
                            const numVal = Number(val);
                            field.onChange(numVal);
                          }

                          if (errors.totalTicketLimit)
                            clearErrors('totalTicketLimit');
                        }}
                      />
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
                        sx={{ mb: 1, display: 'block' }}
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
                        clearErrors('prizes');
                        append({
                          id: crypto.randomUUID(),
                          name: '',
                          type: RafflePrizeType.COINS,
                          amount: 0,
                          quantity: 0,
                          imageUrl: '',
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
                          bgcolor: '#fafafa',
                          position: 'relative',
                          transition: '0.2s',
                          '&:hover': { borderColor: 'green' },
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
                            sx={{ color: 'green', fontWeight: 700 }}
                          >
                            REWARD POSITION #{index + 1}
                          </Typography>
                          <IconButton
                            color="error"
                            size="small"
                            onClick={() => remove(index)}
                            sx={{
                              bgcolor: '#fff',
                              '&:hover': { bgcolor: '#fee' },
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
                              name={`prizes.${index}.quantity`}
                              control={control}
                              render={({ field }) => (
                                <TextField
                                  {...field}
                                  type="number"
                                  label="Quantity"
                                  fullWidth
                                  size="small"
                                  error={!!errors.prizes?.[index]?.quantity}
                                  helperText={
                                    errors.prizes?.[index]?.quantity?.message
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
                                          objectFit: 'cover',
                                          borderRadius: 1,
                                          border: '1px solid #ccc',
                                        }}
                                        onError={(e) => {
                                          e.currentTarget.style.display =
                                            'none';
                                        }}
                                      />
                                      <Button
                                        variant="contained"
                                        color="error"
                                        sx={{ height: 40 }}
                                        onClick={() => field.onChange('')}
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
                      bgcolor: 'green',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      borderRadius: 2,
                      '&:hover': { bgcolor: '#006400' },
                    }}
                    disabled={isCreating || isUpdating}
                  >
                    {mode === FormMode.EDIT ? 'Save Changes' : 'Create Raffle'}
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

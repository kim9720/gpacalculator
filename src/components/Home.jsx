import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Grid,
    Box,
    Typography,
    CssBaseline,
    Paper,
    Alert,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ClearAllIcon from '@mui/icons-material/ClearAll';

const theme = createTheme();

const calculateGPA = (grades) => {
    let totalPoints = 0;
    let totalCredits = 0;
    grades.forEach((grade) => {
        const gradePoints = parseFloat(grade.points);
        const credits = parseFloat(grade.credits);
        totalPoints += gradePoints * credits;
        totalCredits += credits;
    });
    return totalCredits === 0 ? 0 : totalPoints / totalCredits;
};

const Home = () => {
    const [grades, setGrades] = useState([{ id: 1, points: '', credits: '' }]);
    const [gpa, setGpa] = useState(null);
    const [error, setError] = useState('');

    const handleAddGrade = () => {
        const newGrade = { id: grades.length + 1, points: '', credits: '' };
        setGrades([...grades, newGrade]);
    };

    const handleRemoveGrade = (id) => {
        const filteredGrades = grades.filter((grade) => grade.id !== id);
        setGrades(filteredGrades);
    };

    const handleChange = (id, field, value) => {
        const updatedGrades = grades.map((grade) =>
            grade.id === id ? { ...grade, [field]: value } : grade
        );
        setGrades(updatedGrades);
    };

    const handleCalculateGpa = () => {
        // Check if any grade points exceed 5.0 or credits are non-positive
        for (let grade of grades) {
            if (parseFloat(grade.points) > 5.0) {
                setError('Grade points cannot exceed 5.0.');
                return;
            }
            if (parseFloat(grade.credits) <= 0) {
                setError('Credits must be a positive number.');
                return;
            }
        }

        const gpaResult = calculateGPA(grades);

        if (gpaResult > 5.0) {
            setError('Calculated GPA exceeds 5.0, which is not allowed.');
            setGpa(null);
        } else {
            setError('');
            setGpa(gpaResult.toFixed(2));
        }
    };

    const handleClearAll = () => {
        setGrades([{ id: 1, points: '', credits: '' }]);
        setGpa(null);
        setError('');
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth="sm">
                <Paper elevation={3} sx={{ padding: 4, marginTop: 4 }}>
                    <Typography component="h1" variant="h5" align="center">
                        GPA Calculator
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {grades.map((grade) => (
                        <Box key={grade.id} display="flex" alignItems="center" marginTop={2}>
                            <TextField
                                label="Grade Points"
                                variant="outlined"
                                type="number"
                                value={grade.points}
                                onChange={(e) =>
                                    handleChange(grade.id, 'points', e.target.value)
                                }
                                sx={{ marginRight: 2 }}
                                inputProps={{
                                    step: '0.01',
                                    min: '0',
                                    max: '5',
                                }}
                            />
                            <TextField
                                label="Credits"
                                variant="outlined"
                                type="number"
                                value={grade.credits}
                                onChange={(e) =>
                                    handleChange(grade.id, 'credits', e.target.value)
                                }
                                sx={{ marginRight: 2 }}
                                inputProps={{
                                    step: '0.01',
                                    min: '0.1',
                                }}
                            />
                            <Button
                                onClick={() => handleRemoveGrade(grade.id)}
                                color="secondary"
                                variant="outlined"
                                startIcon={<DeleteOutlineIcon />}
                            >
                                Remove
                            </Button>
                        </Box>
                    ))}
                    <Grid container justifyContent="space-between" marginTop={2}>
                        <Button
                            onClick={handleAddGrade}
                            color="primary"
                            variant="outlined"
                            startIcon={<AddCircleOutlineIcon />}
                        >
                            Add Grade
                        </Button>
                        <Button
                            onClick={handleCalculateGpa}
                            color="primary"
                            variant="contained"
                        >
                            Calculate GPA
                        </Button>
                        <Button
                            onClick={handleClearAll}
                            color="warning"
                            variant="outlined"
                            startIcon={<ClearAllIcon />}
                        >
                            Clear All
                        </Button>
                    </Grid>
                    {gpa !== null && (
                        <Typography variant="h6" align="center" marginTop={3}>
                            Your GPA: {gpa}
                        </Typography>
                    )}
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

export default Home;

import React, { useState, useEffect, useRef } from 'react';
import {
    Box,
    Typography,
    Grid,
    Slider,
    Card,
    CardContent,
    Button,
    Chip,
    LinearProgress,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
} from '@mui/material';
import {
    PlayArrow,
    Pause,
    Stop,
    Refresh,
    Business,
    Warning,
    Assessment,
    Timeline,
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip as RechartsTooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';

// Mock data generators for the simulation
const generateMarketData = (rounds, numFirms, modelType) => {
    const data = [];
    const basePrice = modelType === 'cournot' ? 50 : 30;
    const baseQuantity = modelType === 'cournot' ? 20 : 15;

    for (let i = 0; i < rounds; i++) {
        const roundData = {
            round: i + 1,
            marketPrice: basePrice + Math.sin(i * 0.3) * 5 + Math.random() * 3,
            totalQuantity:
                baseQuantity + Math.cos(i * 0.2) * 3 + Math.random() * 2,
            hhi: 0.3 + Math.sin(i * 0.1) * 0.2 + Math.random() * 0.1,
            collusionDetected: i > 5 && Math.random() > 0.7,
        };

        // Add firm-specific data
        for (let j = 0; j < numFirms; j++) {
            roundData[`firm${j + 1}_profit`] =
                (basePrice - 10 - j * 2) * (baseQuantity / numFirms) +
                Math.random() * 10;
            roundData[`firm${j + 1}_quantity`] =
                baseQuantity / numFirms + Math.random() * 2;
            roundData[`firm${j + 1}_price`] = basePrice + Math.random() * 5;
        }

        data.push(roundData);
    }
    return data;
};

const OligopolyDemo = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [currentRound, setCurrentRound] = useState(0);
    const [numFirms, setNumFirms] = useState(3);
    const [modelType, setModelType] = useState('cournot');
    const [demandA, setDemandA] = useState(100);
    const [demandB, setDemandB] = useState(2);
    const [collusionEnabled, setCollusionEnabled] = useState(true);
    const [regulatorEnabled, setRegulatorEnabled] = useState(true);
    const [maxRounds] = useState(20);

    const intervalRef = useRef(null);

    const marketData = generateMarketData(maxRounds, numFirms, modelType);
    const currentData = marketData[currentRound] || {};

    const currentHHI = currentData.hhi || 0;
    const currentPrice = currentData.marketPrice || 0;
    const isColluding = currentData.collusionDetected || false;

    useEffect(() => {
        if (isRunning && currentRound < maxRounds - 1) {
            intervalRef.current = setTimeout(() => {
                setCurrentRound(prev => prev + 1);
            }, 800);
        } else if (currentRound >= maxRounds - 1) {
            setIsRunning(false);
        }

        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
            }
        };
    }, [isRunning, currentRound, maxRounds]);

    const handleStart = () => {
        setIsRunning(true);
        if (currentRound >= maxRounds - 1) {
            setCurrentRound(0);
        }
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleStop = () => {
        setIsRunning(false);
        setCurrentRound(0);
    };

    const handleReset = () => {
        setIsRunning(false);
        setCurrentRound(0);
    };

    const getFirmColors = () => {
        const colors = ['#1976d2', '#2e7d32', '#d32f2f', '#f57c00', '#7b1fa2'];
        return colors.slice(0, numFirms);
    };

    const firmColors = getFirmColors();

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background:
                    'linear-gradient(135deg, #0a0a0a 0%, #0e0e0e 50%, #0a0a0a 100%)',
                color: 'white',
                padding: { xs: 2, sm: 3, md: 4 },
            }}
        >
            {/* Header */}
            <Box sx={{ textAlign: 'center', marginBottom: 4 }}>
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        marginBottom: 2,
                        background: 'linear-gradient(135deg, #ffffff, #808080)',
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Oligopoly Demo
                </Typography>
                <Typography
                    variant="h6"
                    sx={{ color: 'text.secondary', marginBottom: 1 }}
                >
                    Agent-Based Economic Modeling & Collusion Detection
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        color: 'text.secondary',
                        maxWidth: '800px',
                        margin: '0 auto',
                    }}
                >
                    Interactive simulation of oligopoly market competition with
                    real-time firm behavior, collusion detection, and regulatory
                    intervention analysis.
                </Typography>
            </Box>

            {/* Control Panel */}
            <Card
                sx={{
                    marginBottom: 4,
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                }}
            >
                <CardContent>
                    <Grid container spacing={3}>
                        {/* Simulation Controls */}
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h6"
                                sx={{ marginBottom: 2, color: 'primary.light' }}
                            >
                                Simulation Controls
                            </Typography>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    marginBottom: 2,
                                }}
                            >
                                <Button
                                    variant="contained"
                                    startIcon={<PlayArrow />}
                                    onClick={handleStart}
                                    disabled={isRunning}
                                    sx={{ backgroundColor: 'success.main' }}
                                >
                                    Start
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Pause />}
                                    onClick={handlePause}
                                    disabled={!isRunning}
                                >
                                    Pause
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Stop />}
                                    onClick={handleStop}
                                >
                                    Stop
                                </Button>
                                <Button
                                    variant="outlined"
                                    startIcon={<Refresh />}
                                    onClick={handleReset}
                                >
                                    Reset
                                </Button>
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ marginBottom: 1 }}
                                >
                                    Round: {currentRound + 1} / {maxRounds}
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={
                                        ((currentRound + 1) / maxRounds) * 100
                                    }
                                    sx={{ height: 8, borderRadius: 4 }}
                                />
                            </Box>
                        </Grid>

                        {/* Market Parameters */}
                        <Grid item xs={12} md={6}>
                            <Typography
                                variant="h6"
                                sx={{ marginBottom: 2, color: 'primary.light' }}
                            >
                                Market Parameters
                            </Typography>

                            <Box sx={{ marginBottom: 2 }}>
                                <FormControl fullWidth sx={{ marginBottom: 2 }}>
                                    <InputLabel>Model Type</InputLabel>
                                    <Select
                                        value={modelType}
                                        onChange={e =>
                                            setModelType(e.target.value)
                                        }
                                        disabled={isRunning}
                                    >
                                        <MenuItem value="cournot">
                                            Cournot (Quantity Competition)
                                        </MenuItem>
                                        <MenuItem value="bertrand">
                                            Bertrand (Price Competition)
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ marginBottom: 1 }}
                                >
                                    Number of Firms: {numFirms}
                                </Typography>
                                <Slider
                                    value={numFirms}
                                    onChange={(e, value) => setNumFirms(value)}
                                    min={2}
                                    max={5}
                                    step={1}
                                    disabled={isRunning}
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ marginBottom: 1 }}
                                >
                                    Demand Parameter A: {demandA}
                                </Typography>
                                <Slider
                                    value={demandA}
                                    onChange={(e, value) => setDemandA(value)}
                                    min={50}
                                    max={200}
                                    step={10}
                                    disabled={isRunning}
                                />
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <Typography
                                    variant="body2"
                                    sx={{ marginBottom: 1 }}
                                >
                                    Demand Parameter B: {demandB}
                                </Typography>
                                <Slider
                                    value={demandB}
                                    onChange={(e, value) => setDemandB(value)}
                                    min={0.5}
                                    max={5}
                                    step={0.1}
                                    disabled={isRunning}
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={collusionEnabled}
                                            onChange={e =>
                                                setCollusionEnabled(
                                                    e.target.checked
                                                )
                                            }
                                            disabled={isRunning}
                                        />
                                    }
                                    label="Collusion Enabled"
                                />
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={regulatorEnabled}
                                            onChange={e =>
                                                setRegulatorEnabled(
                                                    e.target.checked
                                                )
                                            }
                                            disabled={isRunning}
                                        />
                                    }
                                    label="Regulator Enabled"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Market Metrics */}
            <Grid container spacing={3} sx={{ marginBottom: 4 }}>
                <Grid item xs={12} md={3}>
                    <Card
                        sx={{
                            backgroundColor: 'rgba(26, 26, 26, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center',
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h4"
                                sx={{ color: 'primary.light', fontWeight: 700 }}
                            >
                                ${currentPrice.toFixed(2)}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary' }}
                            >
                                Market Price
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card
                        sx={{
                            backgroundColor: 'rgba(26, 26, 26, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center',
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h4"
                                sx={{ color: 'success.main', fontWeight: 700 }}
                            >
                                {(currentHHI * 100).toFixed(1)}%
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary' }}
                            >
                                HHI Concentration
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card
                        sx={{
                            backgroundColor: 'rgba(26, 26, 26, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center',
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h4"
                                sx={{
                                    color: isColluding
                                        ? 'warning.main'
                                        : 'success.main',
                                    fontWeight: 700,
                                }}
                            >
                                {isColluding ? 'DETECTED' : 'NORMAL'}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary' }}
                            >
                                Collusion Status
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={3}>
                    <Card
                        sx={{
                            backgroundColor: 'rgba(26, 26, 26, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            textAlign: 'center',
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h4"
                                sx={{ color: 'info.main', fontWeight: 700 }}
                            >
                                {numFirms}
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: 'text.secondary' }}
                            >
                                Active Firms
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Market Dynamics Charts */}
            <Card
                sx={{
                    marginBottom: 4,
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ marginBottom: 3, color: 'primary.light' }}
                    >
                        Market Dynamics Over Time
                    </Typography>

                    <Box sx={{ height: 400 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={marketData.slice(0, currentRound + 1)}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="rgba(255,255,255,0.1)"
                                />
                                <XAxis
                                    dataKey="round"
                                    stroke="rgba(255,255,255,0.7)"
                                    tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                />
                                <YAxis
                                    stroke="rgba(255,255,255,0.7)"
                                    tick={{ fill: 'rgba(255,255,255,0.7)' }}
                                />
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor:
                                            'rgba(26, 26, 26, 0.9)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        borderRadius: 8,
                                        color: 'white',
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="marketPrice"
                                    stroke="#1976d2"
                                    fill="rgba(25, 118, 210, 0.3)"
                                    name="Market Price"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="totalQuantity"
                                    stroke="#2e7d32"
                                    fill="rgba(46, 125, 50, 0.3)"
                                    name="Total Quantity"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Box>
                </CardContent>
            </Card>

            {/* Firm Behavior and Collusion Detection */}
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            backgroundColor: 'rgba(26, 26, 26, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{ marginBottom: 3, color: 'primary.light' }}
                            >
                                Firm Behavior Analysis
                            </Typography>

                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={marketData.slice(
                                            0,
                                            currentRound + 1
                                        )}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.1)"
                                        />
                                        <XAxis
                                            dataKey="round"
                                            stroke="rgba(255,255,255,0.7)"
                                            tick={{
                                                fill: 'rgba(255,255,255,0.7)',
                                                fontSize: 10,
                                            }}
                                        />
                                        <YAxis
                                            stroke="rgba(255,255,255,0.7)"
                                            tick={{
                                                fill: 'rgba(255,255,255,0.7)',
                                            }}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'rgba(26, 26, 26, 0.9)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: 8,
                                                color: 'white',
                                            }}
                                        />
                                        {Array.from(
                                            { length: numFirms },
                                            (_, i) => (
                                                <Line
                                                    key={i}
                                                    type="monotone"
                                                    dataKey={`firm${i + 1}_profit`}
                                                    stroke={firmColors[i]}
                                                    strokeWidth={2}
                                                    name={`Firm ${i + 1} Profit`}
                                                    dot={false}
                                                />
                                            )
                                        )}
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>

                            <Alert
                                severity="info"
                                sx={{
                                    marginTop: 2,
                                    backgroundColor: 'rgba(25, 118, 210, 0.1)',
                                }}
                            >
                                <Typography variant="body2">
                                    Firms compete using different strategies:
                                    Tit-for-Tat, Static, and Random Walk. Profit
                                    patterns reveal competitive dynamics and
                                    potential collusion.
                                </Typography>
                            </Alert>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Card
                        sx={{
                            backgroundColor: 'rgba(26, 26, 26, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <CardContent>
                            <Typography
                                variant="h6"
                                sx={{ marginBottom: 3, color: 'primary.light' }}
                            >
                                Collusion Detection & HHI
                            </Typography>

                            <Box sx={{ height: 300 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart
                                        data={marketData.slice(
                                            0,
                                            currentRound + 1
                                        )}
                                    >
                                        <CartesianGrid
                                            strokeDasharray="3 3"
                                            stroke="rgba(255,255,255,0.1)"
                                        />
                                        <XAxis
                                            dataKey="round"
                                            stroke="rgba(255,255,255,0.7)"
                                            tick={{
                                                fill: 'rgba(255,255,255,0.7)',
                                                fontSize: 10,
                                            }}
                                        />
                                        <YAxis
                                            stroke="rgba(255,255,255,0.7)"
                                            tick={{
                                                fill: 'rgba(255,255,255,0.7)',
                                            }}
                                        />
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor:
                                                    'rgba(26, 26, 26, 0.9)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: 8,
                                                color: 'white',
                                            }}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey="hhi"
                                            stroke="#f57c00"
                                            strokeWidth={3}
                                            name="HHI Concentration"
                                            dot={false}
                                        />
                                        <Line
                                            type="monotone"
                                            dataKey={data =>
                                                data.collusionDetected
                                                    ? 0.8
                                                    : 0.2
                                            }
                                            stroke="#d32f2f"
                                            strokeWidth={2}
                                            name="Collusion Detected"
                                            dot={false}
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </Box>

                            <Alert
                                severity={isColluding ? 'warning' : 'success'}
                                sx={{ marginTop: 2 }}
                            >
                                <Typography variant="body2">
                                    {isColluding
                                        ? `Collusion detected! HHI: ${(currentHHI * 100).toFixed(1)}% exceeds threshold.`
                                        : `Market operating normally. HHI: ${(currentHHI * 100).toFixed(1)}% within acceptable range.`}
                                </Typography>
                            </Alert>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Economic Model Overview */}
            <Card
                sx={{
                    marginTop: 4,
                    backgroundColor: 'rgba(26, 26, 26, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
            >
                <CardContent>
                    <Typography
                        variant="h6"
                        sx={{ marginBottom: 3, color: 'primary.light' }}
                    >
                        Economic Model Overview
                    </Typography>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <Box sx={{ marginBottom: 2 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: 'success.main',
                                        marginBottom: 1,
                                    }}
                                >
                                    1. Market Structure
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        marginBottom: 2,
                                    }}
                                >
                                    {modelType === 'cournot'
                                        ? 'Cournot competition: Firms simultaneously choose quantities to maximize profits.'
                                        : 'Bertrand competition: Firms simultaneously choose prices to maximize profits.'}
                                </Typography>
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: 'warning.main',
                                        marginBottom: 1,
                                    }}
                                >
                                    2. Demand Function
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        marginBottom: 2,
                                    }}
                                >
                                    Linear inverse demand: P(Q) = {demandA} -{' '}
                                    {demandB} × Q
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box sx={{ marginBottom: 2 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{ color: 'info.main', marginBottom: 1 }}
                                >
                                    3. Collusion Detection
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'text.secondary',
                                        marginBottom: 2,
                                    }}
                                >
                                    Monitors HHI concentration index and price
                                    patterns to detect cartel behavior.
                                </Typography>
                            </Box>

                            <Box sx={{ marginBottom: 2 }}>
                                <Typography
                                    variant="subtitle2"
                                    sx={{
                                        color: 'secondary.light',
                                        marginBottom: 1,
                                    }}
                                >
                                    4. Regulatory Intervention
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: 'text.secondary' }}
                                >
                                    Automatic penalties and price caps when
                                    collusion thresholds are exceeded.
                                </Typography>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 1,
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                }}
                            >
                                <Chip
                                    icon={<Business />}
                                    label={`${numFirms} Firms`}
                                    color="primary"
                                    variant="outlined"
                                />
                                <Chip
                                    icon={<Assessment />}
                                    label={
                                        modelType === 'cournot'
                                            ? 'Quantity'
                                            : 'Price'
                                    }
                                    color="success"
                                    variant="outlined"
                                />
                                <Chip
                                    icon={<Warning />}
                                    label={
                                        collusionEnabled
                                            ? 'Collusion On'
                                            : 'Collusion Off'
                                    }
                                    color="warning"
                                    variant="outlined"
                                />
                                <Chip
                                    icon={<Timeline />}
                                    label={`${maxRounds} Rounds`}
                                    color="info"
                                    variant="outlined"
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </Box>
    );
};

export default OligopolyDemo;

import React from 'react'
import ChangesTable from '../components/ChangesTable.jsx';
import AssetsTable from '../components/AssetsTable.jsx';
import ErrorsTable from '../components/Errors.jsx';
import Modules from '../components/Modules.jsx';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';


const BuildData = (props) => {
    const getBytes = (number) => {
        if (number < 1000) return `${number} B`;
        if (number < 1000000) return `${(number / 1000).toFixed(2)} KB`;
        return `${(number / 1000000).toFixed(2)} MB`;
    };

    const Parse = (props, i) => {
        const data = props.build;
        const build = data[i];
        const findUniquePaths = [];
        const filePaths = [];
        const totalSizes = build.size;

        for (let j = 0; j < build.chunks.length; j++) {
            for (let k = 0; k < build.chunks[j].modules.length; k++) {
                const path = build.chunks[j].modules[k].name.split('/');
                const sizes = build.chunks[j].modules[k].size;
                const percent = `${((sizes / totalSizes) * 100).toFixed(2)}%`;
                filePaths.push([path.slice(1, path.length).join('/'), sizes, percent]);
                findUniquePaths.push(path.slice(1, path.length - 1).join('/'));
            }
        }

        const uniqueArray = findUniquePaths
            .filter((item, pos) => item && findUniquePaths.indexOf(item) === pos)
            .sort();

        var filePathAry = [];
        var finalArray = [];
        var dirFinalArray = [];

        for (var l = 0; l < uniqueArray.length; l++) {
            for (var k = 0; k < filePaths.length; k++) {
                filePathAry = [filePaths[k][0].split('/'), filePaths[k][1], filePaths[k][2]]
                let uniquePathCheck = filePathAry[0].slice(0, filePathAry[0].length - 1).join('/')
                if (uniqueArray[l] === uniquePathCheck) {
                    finalArray.push({
                        filename: filePathAry[0][filePathAry[0].length - 1],
                        size: filePathAry[1],
                        percentage: filePathAry[2],
                    });
                }
            }
            dirFinalArray.push([uniqueArray[l], finalArray]);
            finalArray = [];
        }

        return dirFinalArray
    }

    let dirFinalArray = Parse(props, props.activeBuild)

    let dirFinalArrayPrev = [];
    if (props.activeBuild > 0) {
        dirFinalArrayPrev = Parse(props, props.activeBuild - 1)
    }

    // MATERIAL UI TABS
    function TabPanel(props) {
        const { children, value, index } = props;

        return (
            <Typography className="tab-panel"
                component="div"
                role="tabpanel"
                hidden={value !== index}
                id={`vertical-tabpanel-${index}`}
                aria-labelledby={`vertical-tab-${index}`}
            >
                {value === index && <Box p={3}>{children}</Box>}
            </Typography>
        );
    }

    TabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.any.isRequired,
        value: PropTypes.any.isRequired,
    };

    function a11yProps(index) {
        return {
            id: `vertical-tab-${index}`,
            'aria-controls': `vertical-tabpanel-${index}`,
        };
    }

    const useStyles = makeStyles(theme => ({
        root: {
            flexGrow: 1,
            backgroundColor: theme.palette.background.paper,
            display: 'flex',
            height: '80%',
            margin: '0 auto',
            maxWidth: '80%',
            marginBottom: '20px'
        },
        tabs: {
            borderRight: `1px solid ${theme.palette.divider}`,
        },
    }));
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };


    return (
        <div className="build-data" className={classes.root}>
            <Tabs
                orientation="vertical"
                variant="scrollable"
                value={value}
                onChange={handleChange}
                aria-label="Vertical tabs example"
                className={classes.tabs}
            >
                <Tab label="Changes" {...a11yProps(0)} />
                <Tab label="Assets" {...a11yProps(1)} />
                <Tab label="Errors" {...a11yProps(2)} />
                <Tab label="Modules" {...a11yProps(3)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <ChangesTable
                    build={props.build}
                    activeBuild={props.activeBuild}
                    getBytes={getBytes}
                    dirFinalArray={dirFinalArray}
                    dirFinalArrayPrev={dirFinalArrayPrev}
                />
            </TabPanel>
            <TabPanel value={value} index={1}>

                <AssetsTable
                    className="assets"
                    build={props.build}
                    activeBuild={props.activeBuild}
                    getBytes={getBytes}
                />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <ErrorsTable
                    className="errors"
                    build={props.build}
                    activeBuild={props.activeBuild}
                />
            </TabPanel>
            <TabPanel value={value} index={3}>
                <Modules
                    build={props.build}
                    activeBuild={props.activeBuild}
                    getBytes={getBytes}
                    dirFinalArray={dirFinalArray}
                />
            </TabPanel>
        </div>
    );
}

export default BuildData;
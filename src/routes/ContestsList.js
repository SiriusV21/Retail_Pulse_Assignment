import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';
import { Space, Spin } from 'antd';
import { Input, Select, Checkbox } from 'antd';
import { List } from 'antd';
import {
    Bar,
    BarChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { HeartOutlined, HeartTwoTone } from '@ant-design/icons';

const ContestsList = ({ data, setContest }) => {
    const { Search } = Input;
    const [results, setResults] = useState();
    const [contests, setContests] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [contestType, setContestType] = useState('');
    const [runge, setRunge] = useState([1, 10]);
    const [showFav, setShowFav] = useState(false);
    const [favContest, setFavContest] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();
    const { Option } = Select;

    useEffect(() => {
        fetch('https://codeforces.com/api/contest.list')
            .then((res) => res.json())
            .then((res) => {
                setResults(res.result);
                console.log(res);
                setContests(res.result);
            })
            .catch((err) => console.log(err));
    }, []);

    useEffect(() => {
        const temp =
            JSON.parse(window.localStorage.getItem('favoriteContest')) || {};
        setFavContest(temp);
    }, []);

    useEffect(() => {
        if (results) {
            setIsLoading(false);
            setContests(results);
        }
    }, [results]);

    const handleClick = (contest) => {
        navigate(`/contest/${contest.id}`);
        setContest(contest);
    };

    const debouncedAction = useCallback(
        debounce((value) => {
            setContests(
                results?.filter((elem) => {
                    return elem.name
                        .toLowerCase()
                        .includes(value.toLowerCase());
                })
            );
        }, 500),
        [results, showFav]
    );

    const handleChange = (e) => {
        const { value } = e.target;

        debouncedAction(value);
    };

    const customFilter = (e) => {
        console.log(e);
        setContestType(e);
        // setContests(results.filter((elem) => elem.type === e));
    };

    const toggleFavorite = (id, state) => {
        setFavContest((prevState) => {
            const newState = { ...prevState, [id]: state };
            window.localStorage.setItem(
                'favoriteContest',
                JSON.stringify(newState)
            );
            return newState;
        });
    };
    const toggleCheckbox = (e) => {
        setShowFav(e.target.checked);
        setRunge([1, 10]);
        setCurrentPage(1);
        //console.log(runge);
    };
    return (
        <>
            {isLoading ? (
                <Space size='middle'>
                    <Spin size='large' />
                </Space>
            ) : (
                <>
                    <Search
                        placeholder='Search for Contests'
                        input
                        enterButton
                        onChange={handleChange}
                    />
                    <Select
                        defaultValue=''
                        style={{ width: 120 }}
                        onChange={customFilter}
                    >
                        <Option value=''>Show All</Option>
                        <Option value='CF'>CF</Option>
                        <Option value='ICPC'>ICPC</Option>
                    </Select>
                    <Checkbox onChange={toggleCheckbox}>
                        Show Favourites
                    </Checkbox>
                    <div style={{ display: 'flex', flexDirection: 'row' }}>
                        <div style={{ width: '60%' }}>
                            <List
                                bordered
                                pagination={{
                                    current: currentPage,
                                    onChange: (page, pageSize) => {
                                        setRunge([page, pageSize]);
                                        setCurrentPage(page);
                                    },
                                    showTotal: (total, range) =>
                                        `${range[0]}-${range[1]} of ${total} items`,
                                }}
                                dataSource={contests
                                    ?.filter((elem) => {
                                        if (showFav)
                                            return (
                                                elem.type.includes(
                                                    contestType
                                                ) && favContest[elem.id]
                                            );
                                        else
                                            return elem.type.includes(
                                                contestType
                                            );
                                    })
                                    .map((elem) => elem)}
                                renderItem={(item) => {
                                    return (
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    favContest[item.id] ? (
                                                        <HeartTwoTone
                                                            onClick={() => {
                                                                toggleFavorite(
                                                                    item.id,
                                                                    false
                                                                );
                                                            }}
                                                        />
                                                    ) : (
                                                        <HeartOutlined
                                                            onClick={() => {
                                                                toggleFavorite(
                                                                    item.id,
                                                                    true
                                                                );
                                                            }}
                                                        />
                                                    )
                                                }
                                                title={
                                                    <div
                                                        onClick={() =>
                                                            handleClick(item)
                                                        }
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        {item.name}
                                                    </div>
                                                }
                                            />
                                        </List.Item>
                                    );
                                }}
                            />
                        </div>
                        <div style={{ width: '40%', height: '400px' }}>
                            <ResponsiveContainer width='100%' height='100%'>
                                <BarChart
                                    width={500}
                                    height={300}
                                    data={contests
                                        .filter((elem) => {
                                            if (showFav)
                                                return (
                                                    elem.type.includes(
                                                        contestType
                                                    ) && favContest[elem.id]
                                                );
                                            else
                                                return elem.type.includes(
                                                    contestType
                                                );
                                        })
                                        .slice(
                                            (runge[0] - 1) * runge[1],
                                            runge[0] * runge[1]
                                        )
                                        .map((elem) => {
                                            var dur = elem.durationSeconds / 60;
                                            elem = {
                                                ...elem,
                                                durationSeconds: dur,
                                            };
                                            // console.log(elem);
                                            return elem;
                                        })}
                                    margin={{
                                        top: 5,
                                        right: 30,
                                        left: 20,
                                        bottom: 5,
                                    }}
                                >
                                    <CartesianGrid strokeDasharray='5 5' />
                                    <XAxis dataKey='name' />
                                    <YAxis dataKey='durationSeconds' />
                                    <Tooltip />
                                    <Bar
                                        type='monotone'
                                        dataKey='durationSeconds'
                                        fill={'#82ca9d'}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default ContestsList;

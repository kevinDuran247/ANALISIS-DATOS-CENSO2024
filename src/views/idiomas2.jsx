import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
    ResponsiveContainer,
    Legend,
    LineChart,
    Line,
    AreaChart,
    Area,
} from 'recharts';
import { Button, FormControl, InputGroup, Container, Row, Col, Card, Dropdown } from 'react-bootstrap';
import { API_BASE_URL } from '../url';

const Idiomas2 = () => {
    const [idiomasData, setIdiomasData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [height, setHeight] = useState(400);
    const [graphType, setGraphType] = useState('Bar');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [filterCategory, setFilterCategory] = useState('Todos');

    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

    useEffect(() => {
        const fetchIdiomasData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}idiomas2`); // Cambié la URL a 'idiomas2'
                const data = await response.json();

                if (data && data.data && Array.isArray(data.data)) {
                    const idiomasTransformados = data.data.slice(1).map((fila) => ({
                        departamento: fila[0],
                        ingles: fila[1] !== null ? parseInt(fila[1], 10) : null,
                        espanol: fila[2] !== null ? parseInt(fila[2], 10) : null,
                        nahuatl: fila[3] !== null ? parseInt(fila[3], 10) : null,
                        pisbi: fila[4] !== null ? parseInt(fila[4], 10) : null,
                        poton: fila[5] !== null ? parseInt(fila[5], 10) : null,
                        lenguaSenal: fila[6] !== null ? parseInt(fila[6], 10) : null,
                        frances: fila[7] !== null ? parseInt(fila[7], 10) : null,
                        italiano: fila[8] !== null ? parseInt(fila[8], 10) : null,
                        otro: fila[9] !== null ? parseInt(fila[9], 10) : null,
                    }));
                    setIdiomasData(idiomasTransformados);
                } else {
                    setError('Datos no disponibles o en formato incorrecto');
                }
            } catch (error) {
                console.error('Error al obtener los datos de Idiomas2:', error);
                setError('Hubo un error al obtener los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchIdiomasData();
    }, []);

    const filteredData = idiomasData.filter((data) => {
        if (filterCategory === 'Todos') {
            return data.departamento && data.departamento.toLowerCase().includes(search.toLowerCase());
        }
        return data[filterCategory] !== null && data[filterCategory] !== undefined;
    });

    const getColumns = () => {
        if (filterCategory === 'Todos') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Inglés', selector: (row) => formatNumber(row.ingles), sortable: true },
                { name: 'Español', selector: (row) => formatNumber(row.espanol), sortable: true },
                { name: 'Náhuatl', selector: (row) => formatNumber(row.nahuatl), sortable: true },
                { name: 'Pisbi (Cacaopera)', selector: (row) => formatNumber(row.pisbi), sortable: true },
                { name: 'Potón (Lenca)', selector: (row) => formatNumber(row.poton), sortable: true },
                { name: 'Lengua de señas (LESSA)', selector: (row) => formatNumber(row.lenguaSenal), sortable: true },
                { name: 'Francés', selector: (row) => formatNumber(row.frances), sortable: true },
                { name: 'Italiano', selector: (row) => formatNumber(row.italiano), sortable: true },
                { name: 'Otro', selector: (row) => formatNumber(row.otro), sortable: true },
            ];
        } else {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: filterCategory, selector: (row) => formatNumber(row[filterCategory]), sortable: true },
            ];
        }
    };

    const sortedData = [...filteredData].sort((a, b) => {
        if (sortColumn) {
            const aValue = a[sortColumn];
            const bValue = b[sortColumn];

            if (aValue < bValue) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        }
        return 0;
    });

    const currentData = sortedData.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

    const handleRowsPerPageChange = (e) => {
        const newRowsPerPage = Number(e.target.value);
        setRowsPerPage(newRowsPerPage);
        setHeight(newRowsPerPage * 45);
    };

    const handleGraphTypeChange = (type) => {
        setGraphType(type);
    };

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    return (
        <Container fluid className="py-4">
            <Row>
                <Col lg={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Datos de Idiomas 2</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <InputGroup>
                                    <FormControl
                                        placeholder="Buscar por departamento"
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <Button
                                        variant="outline-secondary"
                                        onClick={() => setSearch('')}
                                        className="bg-success text-white"
                                    >
                                        Limpiar
                                    </Button>
                                </InputGroup>

                                <div className="ml-4">
                                    <FormControl
                                        as="select"
                                        value={rowsPerPage}
                                        onChange={handleRowsPerPageChange}
                                    >
                                        <option value={5}>5</option>
                                        <option value={10}>10</option>
                                        <option value={20}>20</option>
                                    </FormControl>
                                </div>
                            </div>

                            <div className="mb-2">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Filtrar por
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setFilterCategory('Todos')}>Todos</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('ingles')}>Inglés</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('espanol')}>Español</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('nahuatl')}>Náhuatl</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('pisbi')}>Pisbi (Cacaopera)</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('poton')}>Potón (Lenca)</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('lenguaSenal')}>Lengua de señas (LESSA)</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('frances')}>Francés</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('italiano')}>Italiano</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('otro')}>Otro</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <DataTable
                                columns={getColumns()}
                                data={currentData}
                                onSort={handleSort}
                                sortDirection={sortDirection}
                                sortColumn={sortColumn}
                                highlightOnHover
                            />

                            <div className="d-flex justify-content-between mt-2">
                                <Button
                                    variant="success"
                                    onClick={() => setCurrentPage(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    Anterior
                                </Button>
                                <span>
                                    Página {currentPage} de {Math.ceil(filteredData.length / rowsPerPage)}
                                </span>
                                <Button
                                    variant="success"
                                    onClick={() => setCurrentPage(currentPage + 1)}
                                    disabled={currentPage === Math.ceil(filteredData.length / rowsPerPage)}
                                >
                                    Siguiente
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                <Col lg={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Gráfico</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-2">
                                <Button variant="outline-success" onClick={() => handleGraphTypeChange('Bar')}>
                                    Barras
                                </Button>
                                <Button variant="outline-success" onClick={() => handleGraphTypeChange('Line')}>
                                    Líneas
                                </Button>
                                <Button variant="outline-success" onClick={() => handleGraphTypeChange('Area')}>
                                    Área
                                </Button>
                            </div>

                            {graphType === 'Bar' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={filteredData}>
                                        <XAxis dataKey="departamento" />
                                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                                        <Tooltip formatter={(value) => formatNumber(value)} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Legend />
                                        <Bar dataKey={filterCategory === 'Todos' ? 'ingles' : filterCategory} fill="#28a745" />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}

                            {graphType === 'Line' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    <LineChart data={filteredData}>
                                        <XAxis dataKey="departamento" />
                                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                                        <Tooltip formatter={(value) => formatNumber(value)} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Legend />
                                        <Line dataKey={filterCategory === 'Todos' ? 'ingles' : filterCategory} stroke="#28a745" />
                                    </LineChart>
                                </ResponsiveContainer>
                            )}

                            {graphType === 'Area' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    <AreaChart data={filteredData}>
                                        <XAxis dataKey="departamento" />
                                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                                        <Tooltip formatter={(value) => formatNumber(value)} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Legend />
                                        <Area dataKey={filterCategory === 'Todos' ? 'ingles' : filterCategory} fill="#28a745" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Idiomas2;

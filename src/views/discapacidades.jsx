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
    ComposedChart,
} from 'recharts';
import { Button, FormControl, InputGroup, Container, Row, Col, Card, Dropdown } from 'react-bootstrap';
import { API_BASE_URL } from '../url';

const Discapacidades = () => {
    const [discapacidadesData, setDiscapacidadesData] = useState([]);
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
    const formatPercentage = (num) => (num !== null ? `${(num * 100).toFixed(2)}%` : null);

    useEffect(() => {
        const fetchDiscapacidadesData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}discapacidades`);
                const data = await response.json();

                if (data && data.data && Array.isArray(data.data)) {
                    const discapacidadesTransformados = data.data.slice(1).map((fila) => ({
                        departamento: fila[0],
                        caminar: fila[1] !== null ? parseInt(fila[1], 10) : null,
                        manos: fila[2] !== null ? parseInt(fila[2], 10) : null,
                        recordar: fila[3] !== null ? parseInt(fila[3], 10) : null,
                        vestirse: fila[4] !== null ? parseInt(fila[4], 10) : null,
                        comunicarse: fila[5] !== null ? parseInt(fila[5], 10) : null,
                        ver: fila[6] !== null ? parseInt(fila[6], 10) : null,
                        oir: fila[7] !== null ? parseInt(fila[7], 10) : null,
                        poblacionLimitacion: fila[8] !== null ? parseInt(fila[8], 10) : null,
                        distribucionTotal: fila[9] !== null ? parseFloat(fila[9], 10) : null,
                    }));
                    setDiscapacidadesData(discapacidadesTransformados);
                } else {
                    setError('Datos no disponibles o en formato incorrecto');
                }
            } catch (error) {
                console.error('Error al obtener los datos de Discapacidades:', error);
                setError('Hubo un error al obtener los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchDiscapacidadesData();
    }, []);

    const filteredData = discapacidadesData.filter((data) => {
        if (filterCategory === 'Todos') {
            return data.departamento && data.departamento.toLowerCase().includes(search.toLowerCase());
        }
        return data[filterCategory] !== null && data[filterCategory] !== undefined;
    });

    const getColumns = () => {
        if (filterCategory === 'Todos') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Caminar', selector: (row) => formatNumber(row.caminar), sortable: true },
                { name: 'Manos', selector: (row) => formatNumber(row.manos), sortable: true },
                { name: 'Recordar', selector: (row) => formatNumber(row.recordar), sortable: true },
                { name: 'Vestirse', selector: (row) => formatNumber(row.vestirse), sortable: true },
                { name: 'Comunicarse', selector: (row) => formatNumber(row.comunicarse), sortable: true },
                { name: 'Ver', selector: (row) => formatNumber(row.ver), sortable: true },
                { name: 'Oir', selector: (row) => formatNumber(row.oir), sortable: true },
                { name: 'Población con Limitación', selector: (row) => formatNumber(row.poblacionLimitacion), sortable: true },
                { name: 'Distribución Total', selector: (row) => formatPercentage(row.distribucionTotal), sortable: true },
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
                            <h5 className="mb-0">Datos de Discapacidades</h5>
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
                                        <Dropdown.Item onClick={() => setFilterCategory('caminar')}>Caminar</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('manos')}>Manos</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('recordar')}>Recordar</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('vestirse')}>Vestirse</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('comunicarse')}>Comunicarse</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('ver')}>Ver</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('oir')}>Oir</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('poblacionLimitacion')}>Población con Limitación</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('distribucionTotal')}>Distribución Total</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            <DataTable
                                columns={getColumns()}
                                data={currentData}
                                highlightOnHover
                                className="table-success"
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
                                <Button variant="outline-success" onClick={() => handleGraphTypeChange('Pyramid')}>
                                    Pirámide
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
                                        <Bar
                                            dataKey={filterCategory === 'Todos' ? 'caminar' : filterCategory}
                                            fill="#28a745"
                                        />
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
                                        <Line
                                            dataKey={filterCategory === 'Todos' ? 'caminar' : filterCategory}
                                            stroke="#28a745"
                                        />
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
                                        <Area
                                            dataKey={filterCategory === 'Todos' ? 'caminar' : filterCategory}
                                            fill="#28a745"
                                            stroke="#28a745"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}

                            {graphType === 'Pyramid' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    <ComposedChart layout="vertical" data={filteredData}>
                                        <XAxis type="number" />
                                        <YAxis dataKey="departamento" type="category" />
                                        <Tooltip formatter={(value) => formatNumber(value)} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Legend />
                                        <Bar
                                            dataKey="caminar"
                                            stackId="a"
                                            fill="#28a745"
                                            name="Caminar"
                                        />
                                        <Bar
                                            dataKey="manos"
                                            stackId="a"
                                            fill="#FF8042"
                                            name="Manos"
                                        />
                                    </ComposedChart>
                                </ResponsiveContainer>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default Discapacidades;

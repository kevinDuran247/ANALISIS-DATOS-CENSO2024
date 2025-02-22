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
    RadarChart,
    Radar,
} from 'recharts';
import { Button, FormControl, InputGroup, Container, Row, Col, Card, Dropdown } from 'react-bootstrap';
import { PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import { API_BASE_URL } from '../url';

const TICS = () => {
    const [ticsData, setTicsData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [height, setHeight] = useState(400);
    const [graphType, setGraphType] = useState('Bar');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [filterCategory, setFilterCategory] = useState('Todos'); // Nuevo estado para categoría

    const formatNumber = (num) => new Intl.NumberFormat('en-US').format(num);

    useEffect(() => {
        const fetchTicsData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}tics`);
                const data = await response.json();

                if (data && data.data && Array.isArray(data.data)) {
                    const ticsTransformados = data.data.slice(1).map((fila) => ({
                        departamento: fila[0],
                        usoPC: fila[1] !== null ? parseInt(fila[1], 10) : null,
                        usoLaptop: fila[2] !== null ? parseInt(fila[2], 10) : null,
                        usoTablet: fila[3] !== null ? parseInt(fila[3], 10) : null,
                        usoSmartphone: fila[4] !== null ? parseInt(fila[4], 10) : null,
                        usoCelularBasico: fila[5] !== null ? parseInt(fila[5], 10) : null,
                        internet: fila[6] !== null ? parseInt(fila[6], 10) : null,
                        poblacion: fila[7] !== null ? parseInt(fila[7], 10) : null,
                    })).filter((fila) => 
                        fila.usoPC !== null && 
                        fila.usoLaptop !== null && 
                        fila.usoTablet !== null && 
                        fila.usoSmartphone !== null && 
                        fila.usoCelularBasico !== null && 
                        fila.internet !== null && 
                        fila.poblacion !== null
                    );
                    setTicsData(ticsTransformados);
                } else {
                    setError('Datos no disponibles o en formato incorrecto');
                }
            } catch (error) {
                console.error('Error al obtener los datos de TICS:', error);
                setError('Hubo un error al obtener los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchTicsData();
    }, []);

    // Filtrar los datos según el filtro de categoría seleccionado
    const filteredData = ticsData.filter((data) => {
        if (filterCategory === 'Todos') {
            return data.departamento && data.departamento.toLowerCase().includes(search.toLowerCase());
        }
        return data[filterCategory] !== null && data[filterCategory] !== undefined;
    });

    // Obtener las columnas basadas en la categoría seleccionada
    const getColumns = () => {
        if (filterCategory === 'Todos') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Uso de PC', selector: (row) => formatNumber(row.usoPC), sortable: true },
                { name: 'Uso de Laptop', selector: (row) => formatNumber(row.usoLaptop), sortable: true },
                { name: 'Uso de Tablet', selector: (row) => formatNumber(row.usoTablet), sortable: true },
                { name: 'Uso de Smartphone', selector: (row) => formatNumber(row.usoSmartphone), sortable: true },
                { name: 'Uso de Celular Básico', selector: (row) => formatNumber(row.usoCelularBasico), sortable: true },
                { name: 'Internet', selector: (row) => formatNumber(row.internet), sortable: true },
                { name: 'Población', selector: (row) => formatNumber(row.poblacion), sortable: true },
            ];
        } else if (filterCategory === 'internet') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Internet', selector: (row) => formatNumber(row.internet), sortable: true },
            ];
        } else if (filterCategory === 'usoPC') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Uso de PC', selector: (row) => formatNumber(row.usoPC), sortable: true },
            ];
        } else if (filterCategory === 'usoLaptop') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Uso de Laptop', selector: (row) => formatNumber(row.usoLaptop), sortable: true },
            ];
        } else if (filterCategory === 'usoTablet') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Uso de Tablet', selector: (row) => formatNumber(row.usoTablet), sortable: true },
            ];
        } else if (filterCategory === 'usoSmartphone') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Uso de Smartphone', selector: (row) => formatNumber(row.usoSmartphone), sortable: true },
            ];
        } else if (filterCategory === 'usoCelularBasico') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Uso de Celular Básico', selector: (row) => formatNumber(row.usoCelularBasico), sortable: true },
            ];
        } else if (filterCategory === 'poblacion') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Población', selector: (row) => formatNumber(row.poblacion), sortable: true },
            ];
        }
        return [];
    };

    // Ordenar los datos
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
                {/* Tabla */}
                <Col lg={6}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Datos de TICS</h5>
                        </Card.Header>
                        <Card.Body>
                            {/* Buscador y control de filas */}
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

                            {/* Filtro de categoría */}
                            <div className="mb-2">
                                <Dropdown>
                                    <Dropdown.Toggle variant="success" id="dropdown-basic">
                                        Filtrar por
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => setFilterCategory('Todos')}>Todos</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('usoPC')}>Uso de PC</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('usoLaptop')}>Uso de Laptop</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('usoTablet')}>Uso de Tablet</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('usoSmartphone')}>Uso de Smartphone</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('usoCelularBasico')}>Uso de Celular Básico</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('internet')}>Internet</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('poblacion')}>Población</Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>

                            {/* Tabla de datos */}
                            <DataTable
                                columns={getColumns()}
                                data={currentData}
                                onSort={handleSort}
                                sortDirection={sortDirection}
                                sortColumn={sortColumn}
                                highlightOnHover
                            />

                            {/* Paginación */}
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

                {/* Gráfico */}
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
                                <Button variant="outline-success" onClick={() => handleGraphTypeChange('Radar')}>
                                    Radar
                                </Button>
                            </div>

                            {/* Gráfico dinámico */}
                            {graphType === 'Bar' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    <BarChart data={filteredData}>
                                        <XAxis dataKey="departamento" />
                                        <YAxis tickFormatter={(value) => formatNumber(value)} />
                                        <Tooltip formatter={(value) => formatNumber(value)} />
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <Legend />
                                        <Bar dataKey={filterCategory === 'Todos' ? 'usoPC' : filterCategory} fill="#28a745" />
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
                                        <Line dataKey={filterCategory === 'Todos' ? 'usoPC' : filterCategory} stroke="#28a745" />
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
                                        <Area dataKey={filterCategory === 'Todos' ? 'usoPC' : filterCategory} fill="#28a745" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}

                            {graphType === 'Radar' && (
                                <ResponsiveContainer width="100%" height={400}>
                                    <RadarChart data={filteredData}>
                                        <PolarGrid />
                                        <PolarAngleAxis dataKey="departamento" />
                                        <PolarRadiusAxis />
                                        <Radar
                                            name={filterCategory === 'Todos' ? 'usoPC' : filterCategory}
                                            dataKey={filterCategory === 'Todos' ? 'usoPC' : filterCategory}
                                            stroke="#28a745"
                                            fill="#28a745"
                                            fillOpacity={0.6}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default TICS;

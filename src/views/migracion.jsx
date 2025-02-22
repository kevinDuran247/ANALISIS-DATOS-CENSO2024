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

const Migracion = () => {
    const [migracionData, setMigracionData] = useState([]);
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
        const fetchMigracionData = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}migracion`); // Cambié la URL de 'tics' a 'migracion'
                const data = await response.json();

                if (data && data.data && Array.isArray(data.data)) {
                    const migracionTransformados = data.data.slice(1).map((fila) => ({
                        departamento: fila[0],
                        aquiMismo: fila[1] !== null ? parseInt(fila[1], 10) : null,
                        otroLugar: fila[2] !== null ? parseInt(fila[2], 10) : null,
                        otroPais: fila[3] !== null ? parseInt(fila[3], 10) : null,
                        noSabe: fila[4] !== null ? parseInt(fila[4], 10) : null,
                        total: fila[5] !== null ? parseInt(fila[5], 10) : null,
                    })).filter((fila) => 
                        fila.aquiMismo !== null && 
                        fila.otroLugar !== null && 
                        fila.otroPais !== null && 
                        fila.noSabe !== null && 
                        fila.total !== null
                    );
                    setMigracionData(migracionTransformados);
                } else {
                    setError('Datos no disponibles o en formato incorrecto');
                }
            } catch (error) {
                console.error('Error al obtener los datos de Migración:', error);
                setError('Hubo un error al obtener los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchMigracionData();
    }, []);

    // Filtrar los datos según el filtro de categoría seleccionado
    const filteredData = migracionData.filter((data) => {
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
                { name: 'Aquí, en este mismo lugar / departamento', selector: (row) => formatNumber(row.aquiMismo), sortable: true },
                { name: 'En otro lugar / departamento', selector: (row) => formatNumber(row.otroLugar), sortable: true },
                { name: 'En otro país', selector: (row) => formatNumber(row.otroPais), sortable: true },
                { name: 'No sabe', selector: (row) => formatNumber(row.noSabe), sortable: true },
                { name: 'Total', selector: (row) => formatNumber(row.total), sortable: true },
            ];
        } else if (filterCategory === 'aquiMismo') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Aquí, en este mismo lugar / departamento', selector: (row) => formatNumber(row.aquiMismo), sortable: true },
            ];
        } else if (filterCategory === 'otroLugar') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'En otro lugar / departamento', selector: (row) => formatNumber(row.otroLugar), sortable: true },
            ];
        } else if (filterCategory === 'otroPais') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'En otro país', selector: (row) => formatNumber(row.otroPais), sortable: true },
            ];
        } else if (filterCategory === 'noSabe') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'No sabe', selector: (row) => formatNumber(row.noSabe), sortable: true },
            ];
        } else if (filterCategory === 'total') {
            return [
                { name: 'Departamento', selector: (row) => row.departamento, sortable: true },
                { name: 'Total', selector: (row) => formatNumber(row.total), sortable: true },
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
                            <h5 className="mb-0">Datos de Migración</h5>
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
                                        <Dropdown.Item onClick={() => setFilterCategory('aquiMismo')}>Aquí, en este mismo lugar</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('otroLugar')}>En otro lugar</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('otroPais')}>En otro país</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('noSabe')}>No sabe</Dropdown.Item>
                                        <Dropdown.Item onClick={() => setFilterCategory('total')}>Total</Dropdown.Item>
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
                                        <Bar dataKey={filterCategory === 'Todos' ? 'aquiMismo' : filterCategory} fill="#28a745" />
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
                                        <Line dataKey={filterCategory === 'Todos' ? 'aquiMismo' : filterCategory} stroke="#28a745" />
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
                                        <Area dataKey={filterCategory === 'Todos' ? 'aquiMismo' : filterCategory} fill="#28a745" />
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
                                            name={filterCategory === 'Todos' ? 'aquiMismo' : filterCategory}
                                            dataKey={filterCategory === 'Todos' ? 'aquiMismo' : filterCategory}
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

export default Migracion;

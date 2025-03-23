import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import { GeneratePdfProps } from '@/lib/pdfGenerator';

const pdfStyle = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: '#ffffff',
  },
  coverPage: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  title: {
    fontSize: 28,
    marginBottom: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    color: '#444',
    textAlign: 'center',
  },
  semesterInfo: {
    fontSize: 18,
    marginBottom: 40,
    color: '#444',
    textAlign: 'center',
  },
  userInfo: {
    fontSize: 16,
    marginBottom: 10,
    color: '#666',
    marginTop: 60,
  },
  imageContainer: {
    marginVertical: 20,
  },
  image: {
    width: '100%',
    marginBottom: 10,
    objectFit: 'contain',
  },
  imageName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  caption: {
    fontSize: 12,
    color: '#666',
    marginBottom: 20,
  },
  pageNumber: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#999',
  },
});

const getCurrentSemesterYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const semester = month <= 6 ? 'primeiro' : 'segundo';
  return `para o ${semester} semestre de ${year}`;
};

const PortfolioPDF = ({
  images,
  portfolioName,
  studentName,
  teacherName,
}: GeneratePdfProps) => (
  <Document>
    <Page size="A4" style={pdfStyle.page}>
      <View style={pdfStyle.coverPage}>
        <Text style={pdfStyle.title}>
          Portfólio de Aulas Práticas
        </Text>
        <Text style={pdfStyle.subtitle}>
          referente à disciplina {portfolioName}
        </Text>
        <Text style={pdfStyle.semesterInfo}>
          {getCurrentSemesterYear()}
        </Text>
        <Text style={pdfStyle.userInfo}>
          Discente: {studentName}
        </Text>
        <Text style={pdfStyle.userInfo}>
          Docente: {teacherName}
        </Text>
      </View>
    </Page>

    {images && images.length > 0 ? images.map((image, index) => (
      <Page key={image.id} size="A4" style={pdfStyle.page}>
        <View style={pdfStyle.imageContainer}>
          <Image src={image.url} style={pdfStyle.image} />
          <Text style={pdfStyle.imageName}>{image.imageName || ''}</Text>
          <Text style={pdfStyle.caption}>{image.caption || ''}</Text>
        </View>
        <Text style={pdfStyle.pageNumber}>{index + 2}</Text>
      </Page>
    )) : null}
  </Document>
);

export default PortfolioPDF;


import { Document, Page, Text, View, StyleSheet, Image, Svg, Path } from '@react-pdf/renderer';
import { GeneratePdfProps } from '@/lib/pdfGenerator';
import { Annotation } from '@/types';

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
    position: 'relative',
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
  annotationText: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 5,
    borderRadius: 3,
    color: 'white',
    fontSize: 10,
  },
  annotationArrow: {
    position: 'absolute',
  },
});

const getCurrentSemesterYear = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const semester = month <= 6 ? 'primeiro' : 'segundo';
  return `para o ${semester} semestre de ${year}`;
};

// Render annotation in PDF
const AnnotationPDF = ({ annotation, pageWidth }: { annotation: Annotation, pageWidth: number }) => {
  // Scale the annotation positions and sizes to fit the PDF
  const arrowLength = (annotation.arrowLength / 100) * pageWidth * 0.5;
  const x = (annotation.x / 100) * pageWidth;
  const y = annotation.y * 2; // Adjust Y position for PDF
  const textX = x - 120; // Position text to the left of the arrow start
  
  // Calculate arrow end coordinates based on angle
  const angleInRadians = (annotation.arrowAngle * Math.PI) / 180;
  const arrowEndX = x + arrowLength * Math.cos(angleInRadians);
  const arrowEndY = y + arrowLength * Math.sin(angleInRadians);
  
  return (
    <>
      {/* Annotation text */}
      <View style={[
        styleSheet.annotationText,
        { 
          left: textX, 
          top: y - 10,
          maxWidth: 100,
          color: annotation.color,
        }
      ]}>
        <Text>{annotation.text}</Text>
      </View>
      
      {/* Arrow line */}
      <Svg height={500} width={pageWidth} style={{ position: 'absolute', top: 0, left: 0 }}>
        <Path
          d={`M ${x} ${y} L ${arrowEndX} ${arrowEndY}`}
          stroke={annotation.color}
          strokeWidth={1}
        />
        {/* Arrow head */}
        <Path
          d={`M ${arrowEndX-5} ${arrowEndY-5} L ${arrowEndX} ${arrowEndY} L ${arrowEndX-5} ${arrowEndY+5}`}
          fill={annotation.color}
        />
      </Svg>
    </>
  );
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
          
          {/* Render annotations if they exist */}
          {image.annotations && image.annotations.length > 0 && image.annotations.map(annotation => (
            <AnnotationPDF key={annotation.id} annotation={annotation} pageWidth={500} />
          ))}
          
          <Text style={pdfStyle.imageName}>{image.imageName || ''}</Text>
          <Text style={pdfStyle.caption}>{image.caption || ''}</Text>
        </View>
        <Text style={pdfStyle.pageNumber}>{index + 2}</Text>
      </Page>
    )) : null}
  </Document>
);

export default PortfolioPDF;

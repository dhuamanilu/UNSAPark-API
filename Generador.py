import os
import re

# Ruta de la carpeta a procesar (donde se ubicará Generador.py)
SRC_DIR = os.path.dirname(os.path.abspath(__file__))

# Nombre del archivo de salida
OUTPUT_FILE = os.path.join(SRC_DIR, 'concatenado.txt')

# Patrón para eliminar bloques <style scoped>...</style> en archivos .vue
STYLE_SCOPED_PATTERN = re.compile(r'<style\s+scoped>.*?</style>', re.DOTALL)

# Carpetas a ignorar
CARPETAS_IGNORADAS = {'node_modules', '.git', 'dist', 'build', '__pycache__'}

def procesar_archivo(ruta):
    """Lee un archivo .js o .vue y devuelve su contenido, filtrando estilos scoped en .vue."""
    with open(ruta, 'r', encoding='utf-8') as f:
        contenido = f.read()
    if ruta.endswith('.vue'):
        # Eliminar bloques <style scoped>
        contenido = STYLE_SCOPED_PATTERN.sub('', contenido)
    return contenido

def main():
    partes = []
    for root, dirs, files in os.walk(SRC_DIR):
        # Modificar dirs in-place para evitar que os.walk entre en carpetas ignoradas
        dirs[:] = [d for d in dirs if d not in CARPETAS_IGNORADAS]
        
        for nombre in files:
            if nombre.endswith(('.tsx', '.ts')):
                ruta_archivo = os.path.join(root, nombre)
                print(f'Procesando: {ruta_archivo}')
                try:
                    contenido = procesar_archivo(ruta_archivo)
                    partes.append(f"{nombre}:\n{contenido}")
                except Exception as e:
                    print(f'Error al procesar {ruta_archivo}: {e}')
    
    # Concatenar todo en un solo string
    resultado = '\n\n'.join(partes)
    
    # Escribir al archivo de salida
    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        f.write(resultado)
    
    print(f'Concatenación completa. Archivo generado en: {OUTPUT_FILE}')
    print(f'Total de archivos procesados: {len(partes)}')

if __name__ == '__main__':
    main()

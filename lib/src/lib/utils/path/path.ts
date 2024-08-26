import { normalize, sep } from 'path';
import { isArrayEmpty } from '../array/array';

/**
 * Extracts the path of the directory from a file path.
 *
 * @example
 * // Returns 'folder/sub-folder'
 * extractDirectoryPath('folder/sub-folder/image.png');
 */
export const extractDirectoryPath = (filePath: string) => filePath.substring(0, filePath.lastIndexOf('/'));

/**
 * Extracts the file name of the file path.
 *
 * @example
 * // Returns 'image.png'
 * extractFileName('folder/sub-folder/image.png');
 */
export const extractFileName = (filePath: string) => filePath.substring(filePath.lastIndexOf('/') + 1);

/**
 * Extracts the extension of the file path.
 *
 * @example
 * // Returns 'png'
 * extractFileExtension('folder/sub-folder/image.png');
 */
export const extractFileExtension = (filePath: string) => filePath.substring(filePath.lastIndexOf('.') + 1);

/**
 * Inspects every part of the path and returns `true` when:
 * - None of them contains one of the invalid characters
 * - Is not too long
 * - The whole path is not too long
 */
export function isValidPath(path: string) {
    if (path.length > 260) return false;

    return isArrayEmpty(
        normalize(path)
            .split(sep)
            .filter((pathPart) => Boolean(pathPart.match(/[/\\:*?"<>|]/g)) || pathPart.length > 255)
    );
}

/** Verifies that the file path ends with a valid file extension. */
export const isValidFilePath = (filePath: string) =>
    isValidPath(filePath) && validFileExtensions.includes(extractFileExtension(filePath));

export const isTextFile = (filePath: string) => textFileExtensions.includes(extractFileExtension(filePath));

export const isBinaryFile = (filePath: string) => binaryFileExtensions.includes(extractFileExtension(filePath));

const textFileExtensions = [
    'txt',
    'md',
    'html',
    'css',
    'js',
    'json',
    'xml',
    'csv',
    'log',
    'rtf',
    'ini',
    'conf',
    'yaml',
    'yml',
    'tex',
    'doc',
    'docx',
    'odt',
    'wpd',
    'bat',
    'sh',
    'py',
    'java',
    'cpp',
    'c',
    'php',
    'asp',
    'jsp',
    'pl',
    'rb',
    'swift',
    'go',
    'rs',
    'ts',
    'jsx',
    'tsx',
    'scss',
    'less',
    'coffee',
    'haml',
    'jade',
    'pug',
    'ejs',
    'mustache',
    'hbs',
    'twig',
    'liquid',
    'erb',
    'rhtml',
    'aspx',
    'cshtml',
    'vbhtml',
    'jspf',
    'jspx',
    'php3',
    'php4',
    'php5',
    'phtml',
    'cfm',
    'cfml',
    'dtd',
    'xsd',
    'xsl',
    'xslt',
    'xquery',
    'xq',
    'xql',
    'xqm',
    'xqy',
    'xpl',
    'xproc',
    'xbl',
    'rng',
    'rnc',
    'sch',
    'nvdl',
    'wsdl',
    'soap',
    'jsonld',
    'geojson',
    'topojson',
    'ndjson',
    'json5',
    'hjson',
    'cson',
    'bson',
    'ion',
    'ubjson',
    'smile',
    'cbor',
    'msgpack',
    'hocon',
    'properties',
    'env',
    'dotenv',
    'cfg',
    'cnf',
    'config',
    'rc',
    'dot',
    'gv',
    'plantuml',
    'puml',
    'iuml',
    'wsd',
    'mscgen',
    'msgenny',
    'blockdiag',
    'seqdiag',
    'actdiag',
    'nwdiag',
    'packetdiag',
    'rackdiag',
    'c4',
    'c4model',
    'c4plantuml',
    'c4puml',
    'c4iuml',
    'c4wsd',
    'c4mscgen',
    'c4msgenny',
    'c4blockdiag',
    'c4seqdiag',
    'c4actdiag',
    'c4nwdiag',
    'c4packetdiag',
    'c4rackdiag',
    'c4dot',
    'c4gv',
];

const binaryFileExtensions = [
    'jpg',
    'jpeg',
    'png',
    'gif',
    'bmp',
    'tiff',
    'psd',
    'mp4',
    'mkv',
    'avi',
    'mov',
    'mpg',
    'vob',
    'mp3',
    'aac',
    'wav',
    'flac',
    'ogg',
    'mka',
    'wma',
    'pdf',
    'doc',
    'xls',
    'ppt',
    'docx',
    'xlsx',
    'pptx',
    'odt',
    'zip',
    'rar',
    '7z',
    'tar',
    'iso',
    'mdb',
    'accde',
    'frm',
    'sqlite',
    'exe',
    'dll',
    'so',
    'class',
];

/** File extensions of files that are managed by the system. */
const validFileExtensions = [...textFileExtensions, ...binaryFileExtensions];

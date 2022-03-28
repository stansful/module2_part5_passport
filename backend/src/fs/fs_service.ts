import fsPromises from 'fs/promises';
import fs, { ObjectEncodingOptions, PathLike } from 'fs';
import util from 'util';
import EventEmitter from 'events';

const fsExistPromise = util.promisify(fs.exists);

class FsService {
  public async appendFile(
    filePath: PathLike | fsPromises.FileHandle,
    data: string | Uint8Array,
    options?: ObjectEncodingOptions & fsPromises.FlagAndOpenMode,
  ) {
    await fsPromises.appendFile(filePath, data, options);
  }

  public async checkExistFolder(path: PathLike) {
    const isExist = await fsExistPromise(path);
    if (!isExist) {
      throw new Error('Folder does not exist');
    }
  }

  public async makeDirectory(path: PathLike, options?: fs.MakeDirectoryOptions) {
    return fsPromises.mkdir(path, options);
  }

  public async readdir(path: PathLike, options?: fs.ObjectEncodingOptions) {
    return fsPromises.readdir(path, options);
  }

  public async moveFile(oldPath: PathLike, newPath: PathLike) {
    await fsPromises.rename(oldPath, newPath);
  }

  public async readFile(
    path: fs.PathLike | fsPromises.FileHandle,
    options?: { encoding?: null | undefined; flag?: fs.OpenMode | undefined } & EventEmitter.Abortable,
  ) {
    return fsPromises.readFile(path, options);
  }
}

export const fsService = new FsService();

import { Module, ModuleMetadata } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ModelDefinition } from '@nestjs/mongoose';

interface MongooseModuleMetadata extends ModuleMetadata {
  models: ModelDefinition[];
}

export default function ModuleWithModel(
  moduleMetadata: MongooseModuleMetadata,
): ClassDecorator {
  const metadata: ModuleMetadata = {
    imports: moduleMetadata.imports ? moduleMetadata.imports : [],
    providers: moduleMetadata.providers ? moduleMetadata.providers : [],
    controllers: moduleMetadata.controllers ? moduleMetadata.controllers : [],
    exports: moduleMetadata.exports ? moduleMetadata.exports : [],
  };
  metadata.imports.unshift(MongooseModule.forFeature(moduleMetadata.models));
  return Module(metadata);
}
